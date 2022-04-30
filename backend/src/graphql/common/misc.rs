use crate::constant::system::password_reset;
use crate::database::entity::UserEntity;
use crate::database::service;
use crate::graphql::security::{self, crypto::hash};
use crate::graphql::GraphqlError;
use async_graphql::{Context, ErrorExtensions, Result};
use chrono::Local;

pub fn is_password_reset_token_valid(token: &str, ctx: &Context<'_>) -> Result<UserEntity> {
    let conn = super::get_conn(ctx)?;

    let cipher_pass = &password_reset::CIPHER_PASSWORD;
    let claims = security::decrypt_verification_token(token, cipher_pass)
        .map_err(|_| GraphqlError::ValidationError("Invalid token.".into(), "token").extend())?;

    let user = super::convert_query_result(
        service::find_user_by_id(claims.user_id, &conn),
        "Failed to get the user with token",
    )?;

    let token_record = super::convert_query_result(
        service::find_password_reset_token_by_user_id(user.id, &conn),
        "Failed to get password_reset_token",
    )?;

    let now = Local::now().naive_local();
    let duration = now - token_record.created_at;
    if *password_reset::LINK_MAX_MINUTES < duration.num_minutes() {
        let e = GraphqlError::ValidationError("Token has expired.".into(), "token");
        return Err(e.extend());
    }

    let token_digest = token_record.token;
    let digest_secret = &password_reset::DIGEST_SECRET_KEY;
    let matching = hash::verify(&token_digest, &claims.token, digest_secret);
    if !matching.unwrap_or(false) {
        let m = "Token does not match.";
        let e = GraphqlError::ValidationError(m.into(), "token");
        return Err(e.extend());
    }

    Ok(user)
}
