use argonautica::{Error, Hasher, Verifier};
use async_graphql::Result;

pub fn make(password: &str, secret: &str) -> Result<String, Error> {
    Hasher::default()
        .with_password(password)
        .with_secret_key(secret)
        .hash()
}

pub fn verify(hash: &str, password: &str, secret: &str) -> Result<bool, Error> {
    Verifier::default()
        .with_hash(hash)
        .with_password(password)
        .with_secret_key(secret)
        .verify()
}
