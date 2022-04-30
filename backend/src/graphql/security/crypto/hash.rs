use argonautica::{Error, Hasher, Verifier};
use async_graphql::Result;
use base64;
use hmac::{Hmac, Mac};
use sha2::Sha256;

type HmacSha256 = Hmac<Sha256>;

pub fn make(data: &str, secret: &str) -> Result<String> {
    let mac = HmacSha256::new_from_slice(secret.as_bytes())?;
    let hash = mac.chain_update(data).finalize();
    Ok(base64::encode(hash.into_bytes()))
}

pub fn verify(hash: &str, data: &str, secret: &str) -> Result<bool> {
    let hash = base64::decode(hash)?;
    let mac = HmacSha256::new_from_slice(secret.as_bytes())?;
    let result = mac.chain_update(data).verify_slice(&hash).is_ok();
    Ok(result)
}

pub fn argon2_make(password: &str, secret: &str) -> Result<String, Error> {
    Hasher::default()
        .with_password(password)
        .with_secret_key(secret)
        .hash()
}

pub fn argon2_verify(hash: &str, password: &str, secret: &str) -> Result<bool, Error> {
    Verifier::default()
        .with_hash(hash)
        .with_password(password)
        .with_secret_key(secret)
        .verify()
}
