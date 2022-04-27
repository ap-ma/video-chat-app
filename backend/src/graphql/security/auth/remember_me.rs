use super::Identity;
use crate::claims::Claims;
use crate::constant::system::{
    APP_DOMAIN, REMEMBER_CIPHER_PASSWORD, REMEMBER_DIGEST_SECRET_KEY, REMEMBER_MAX_DAYS,
    REMEMBER_TOKEN_COOKIE_NAME,
};
use crate::database::entity::{ChangeUserEntity, UserEntity};
use crate::database::service;
use crate::graphql::common;
use crate::graphql::security::crypto::{cipher, hash, random};
use crate::graphql::GraphqlError;
use crate::token::RememberToken;
use actix_web::cookie::{time::Duration, CookieBuilder, SameSite};
use actix_web::http::header::SET_COOKIE;
use async_graphql::{Context, ErrorExtensions, Result};
use serde_json;

const TOKEN_LEN: usize = 20;

pub fn remember(user_id: u64, remember_me: &Option<bool>, ctx: &Context<'_>) -> Result<()> {
    if !remember_me.unwrap_or(false) {
        return Ok(());
    }

    let conn = common::get_conn(ctx)?;

    let token = random::gen(TOKEN_LEN);
    let digest = hash::make(&token, &REMEMBER_DIGEST_SECRET_KEY);
    if let Err(e) = digest {
        return Err(GraphqlError::ServerError(
            "Failed to create remember token digest".into(),
            format!("{}", e),
        )
        .extend());
    }

    let digest = digest.unwrap();
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
    let remember_token = cipher::str_encrypt(&claims_json, &REMEMBER_CIPHER_PASSWORD);
    if let Err(e) = remember_token {
        return Err(GraphqlError::ServerError(
            "Failed to encrypt remember token".into(),
            format!("{:?}", e),
        )
        .extend());
    }

    let remember_token = remember_token.unwrap();
    set_remember_token_cookie(&remember_token, Duration::days(*REMEMBER_MAX_DAYS), ctx);

    Ok(())
}

pub fn attempt_with_remember_token(ctx: &Context<'_>) -> Result<Option<Identity>> {
    if let Some((claims, user)) = get_user_by_remember_token(ctx)? {
        if let Some(entity_remember_token) = &user.remember_token {
            let matching = hash::verify(
                entity_remember_token,
                &claims.token,
                &REMEMBER_DIGEST_SECRET_KEY,
            );
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

        set_remember_token_cookie("", Duration::seconds(-1), ctx);
    }

    Ok(())
}

fn get_user_by_remember_token(ctx: &Context<'_>) -> Result<Option<(Claims, UserEntity)>> {
    let conn = common::get_conn(ctx)?;

    let remember_token = ctx.data::<RememberToken>();
    if let Some(remember_token) = remember_token.ok().and_then(|token| token.0.as_ref()) {
        let claims_json = cipher::str_decrypt(remember_token, &REMEMBER_CIPHER_PASSWORD);
        if let Err(e) = claims_json {
            return Err(GraphqlError::ServerError(
                "Failed to composite remember token".into(),
                format!("{:?}", e),
            )
            .extend());
        }

        let claims_json = claims_json.unwrap();
        let claims = serde_json::from_str::<Claims>(&claims_json);
        if let Err(e) = claims {
            return Err(GraphqlError::ServerError(
                "Invalid remember token".into(),
                format!("{}", e),
            )
            .extend());
        }

        let claims = claims.unwrap();
        let user = service::find_user_by_id(claims.user_id, &conn).ok();

        return Ok(user.map(|user| (claims, user)));
    }

    Ok(None)
}

fn set_remember_token_cookie(remember_token: &str, max_age: Duration, ctx: &Context<'_>) {
    let cookie = CookieBuilder::new(REMEMBER_TOKEN_COOKIE_NAME, remember_token)
        .domain(APP_DOMAIN.as_str())
        .max_age(max_age)
        .http_only(true)
        .same_site(SameSite::Lax)
        .secure(true)
        .path("/")
        .finish();

    ctx.append_http_header(SET_COOKIE, cookie.to_string());
}
