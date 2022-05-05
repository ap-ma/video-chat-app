pub mod auth;
pub mod crypto;
pub mod guard;
pub mod validator;

use crate::claims::Claims;
use crate::constant::system::{password::SECRET_KEY, VERIFICATION_TOKEN_LEN};
use crate::graphql::GraphqlError;
use argonautica::Error;
use async_graphql::{ErrorExtensions, Result};
use crypto::{cipher, hash, random};

pub use guard::{ResourceGuard, RoleGuard};

pub fn password_hash(password: &str) -> Result<String, Error> {
    hash::argon2_make(password, SECRET_KEY.as_str())
}

pub fn password_verify(hash: &str, password: &str) -> Result<bool, Error> {
    hash::argon2_verify(hash, password, SECRET_KEY.as_str())
}

pub fn create_verification_token(
    user_id: u64,
    digest_secret: &str,
    cipher_password: &str,
) -> Result<(String, String)> {
    let token = random::gen(*VERIFICATION_TOKEN_LEN);
    let token_digest = hash::make(&token, digest_secret).map_err(|e| {
        let m = "Failed to create verification token digest.";
        let e = GraphqlError::ServerError(m.into(), e.message.to_string());
        e.extend()
    })?;

    let claims = Claims {
        user_id,
        token: token,
    };

    let claims_json = serde_json::to_string(&claims).unwrap();
    let encrypted_token = cipher::str_encrypt(&claims_json, cipher_password).map_err(|e| {
        let m = "Failed to encrypt verification token.";
        let d = e.message.clone();
        let e = GraphqlError::ServerError(m.into(), d);
        e.extend()
    })?;

    Ok((token_digest, encrypted_token))
}

pub fn decrypt_verification_token(encrypted_token: &str, cipher_password: &str) -> Result<Claims> {
    let claims_json = cipher::str_decrypt(encrypted_token, cipher_password).map_err(|e| {
        let m = "Failed to decrypt verification token.";
        let e = GraphqlError::ServerError(m.into(), e.message.clone());
        e.extend()
    })?;

    let claims = serde_json::from_str::<Claims>(&claims_json).map_err(|e| {
        let m = "Invalid verification token.";
        let e = GraphqlError::ServerError(m.into(), e.to_string());
        e.extend()
    })?;

    Ok(claims)
}
