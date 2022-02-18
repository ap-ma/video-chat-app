use actix_web::Result;
use argonautica::{Error, Hasher, Verifier};
use once_cell::sync::Lazy;

static SECRET_KEY: Lazy<String> =
    Lazy::new(|| std::env::var("SECRET_KEY").expect("Unable to get SECRET_KEY"));

pub fn hash(password: &str) -> Result<String, Error> {
    Hasher::default()
        .with_password(password)
        .with_secret_key(SECRET_KEY.as_str())
        .hash()
}

pub fn verify(hash: &str, password: &str) -> Result<bool, Error> {
    Verifier::default()
        .with_hash(hash)
        .with_password(password)
        .with_secret_key(SECRET_KEY.as_str())
        .verify()
}
