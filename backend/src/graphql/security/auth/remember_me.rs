use super::Identity;
use crate::claims::Claims;
use crate::constant::system::remember::{
    CIPHER_PASSWORD, DIGEST_SECRET_KEY, MAX_DAYS, TOKEN_COOKIE_NAME,
};
use crate::constant::system::APP_DOMAIN;
use crate::database::entity::{ChangeUserEntity, UserEntity};
use crate::database::service;
use crate::graphql::common;
use crate::graphql::security;
use crate::graphql::security::crypto::hash;
use crate::remember_token::RememberToken;
use actix_web::cookie::{time::Duration, CookieBuilder, SameSite};
use actix_web::http::header::SET_COOKIE;
use async_graphql::{Context, Result};

pub fn remember(user_id: u64, remember_me: &Option<bool>, ctx: &Context<'_>) -> Result<()> {
    let conn = common::get_conn(ctx)?;

    if remember_me.unwrap_or(false) {
        let (token_digest, token) =
            security::create_verification_token(user_id, &DIGEST_SECRET_KEY, &CIPHER_PASSWORD)?;

        let change_user = ChangeUserEntity {
            id: user_id,
            remember_token: Some(Some(token_digest)),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_user(change_user, &conn),
            "Failed to update user",
        )?;

        set_remember_token_cookie(&token, Duration::days(*MAX_DAYS), ctx);
    }

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

    set_remember_token_cookie("", Duration::seconds(0), ctx);

    Ok(())
}

fn get_user_by_remember_token(ctx: &Context<'_>) -> Result<Option<(Claims, UserEntity)>> {
    let conn = common::get_conn(ctx)?;

    let remember_token = ctx.data::<RememberToken>();
    if let Some(remember_token) = remember_token.ok().and_then(|token| token.0.as_ref()) {
        let claims = security::decrypt_verification_token(remember_token, &CIPHER_PASSWORD)?;
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
