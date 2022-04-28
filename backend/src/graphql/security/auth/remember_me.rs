use super::Identity;
use crate::claims::Claims;
use crate::constant::system::{
    remember::{CIPHER_PASSWORD, DIGEST_SECRET_KEY, MAX_DAYS, TOKEN_COOKIE_NAME, TOKEN_LEN},
    APP_DOMAIN,
};
use crate::database::entity::{ChangeUserEntity, UserEntity};
use crate::database::service;
use crate::graphql::common;
use crate::graphql::security::crypto::{cipher, hash, random};
use crate::graphql::GraphqlError;
use crate::remember_token::RememberToken;
use actix_web::cookie::{time::Duration, CookieBuilder, SameSite};
use actix_web::http::header::SET_COOKIE;
use async_graphql::{Context, ErrorExtensions, Result};
use serde_json;

pub fn remember(user_id: u64, remember_me: &Option<bool>, ctx: &Context<'_>) -> Result<()> {
    let conn = common::get_conn(ctx)?;

    if !remember_me.unwrap_or(false) {
        return Ok(());
    }

    let token = random::gen(TOKEN_LEN);
    let digest = hash::make(&token, &DIGEST_SECRET_KEY).map_err(|e| {
        let m = "Failed to create remember token digest";
        let e = GraphqlError::ServerError(m.into(), e.to_string());
        e.extend()
    })?;

    let change_user = ChangeUserEntity {
        id: user_id,
        remember_token: Some(Some(digest)),
        ..Default::default()
    };

    common::convert_query_result(
        service::update_user(change_user, &conn),
        "Failed to update user",
    )?;

    let claims = Claims {
        user_id,
        token: token,
    };

    let claims_json = serde_json::to_string(&claims).unwrap();
    let remember_token = cipher::str_encrypt(&claims_json, &CIPHER_PASSWORD).map_err(|e| {
        let m = "Failed to encrypt remember token";
        let d = e.message.clone();
        let e = GraphqlError::ServerError(m.into(), d);
        e.extend()
    })?;

    set_remember_token_cookie(&remember_token, Duration::days(*MAX_DAYS), ctx);

    Ok(())
}

pub fn attempt_with_remember_token(ctx: &Context<'_>) -> Result<Option<Identity>> {
    if let Some((claims, user)) = get_user_by_remember_token(ctx)? {
        if let Some(entity_remember_token) = &user.remember_token {
            let matching = hash::verify(entity_remember_token, &claims.token, &DIGEST_SECRET_KEY);
            if matching.unwrap_or(false) {
                super::sign_in(&user, ctx)?;
                return Ok(Some(Identity::from(&user)));
            }
        }
    }

    Ok(None)
}

pub fn purge_remember_token(ctx: &Context<'_>) -> Result<()> {
    let conn = common::get_conn(ctx)?;

    if let Some((_, user)) = get_user_by_remember_token(ctx)? {
        let change_user = ChangeUserEntity {
            id: user.id,
            remember_token: Some(None),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_user(change_user, &conn),
            "Failed to update user",
        )?;
    }

    set_remember_token_cookie("", Duration::seconds(-1), ctx);

    Ok(())
}

fn get_user_by_remember_token(ctx: &Context<'_>) -> Result<Option<(Claims, UserEntity)>> {
    let conn = common::get_conn(ctx)?;

    let remember_token = ctx.data::<RememberToken>();
    if let Some(remember_token) = remember_token.ok().and_then(|token| token.0.as_ref()) {
        let claims_json = cipher::str_decrypt(remember_token, &CIPHER_PASSWORD).map_err(|e| {
            let m = "Failed to composite remember token";
            let e = GraphqlError::ServerError(m.into(), e.message.clone());
            e.extend()
        })?;

        let claims = serde_json::from_str::<Claims>(&claims_json).map_err(|e| {
            let m = "Invalid remember token";
            let e = GraphqlError::ServerError(m.into(), e.to_string());
            e.extend()
        })?;

        let user = service::find_user_by_id(claims.user_id, &conn).ok();
        return Ok(user.map(|user| (claims, user)));
    }

    Ok(None)
}

fn set_remember_token_cookie(remember_token: &str, max_age: Duration, ctx: &Context<'_>) {
    let cookie = CookieBuilder::new(TOKEN_COOKIE_NAME, remember_token)
        .domain(APP_DOMAIN.as_str())
        .max_age(max_age)
        .http_only(true)
        .same_site(SameSite::Lax)
        .secure(true)
        .path("/")
        .finish();

    ctx.append_http_header(SET_COOKIE, cookie.to_string());
}
