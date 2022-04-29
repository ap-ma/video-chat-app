use super::random;
use aes_gcm::aead::{generic_array::GenericArray, Aead, NewAead};
use aes_gcm::Aes256Gcm;
use async_graphql::Result;
use base64;
use pbkdf2::{password_hash::PasswordHasher, Pbkdf2};
use std::str;

const NONCE_LEN: usize = 12;
const SALT_LEN: usize = 32;

pub fn str_encrypt(data: &str, password: &str) -> Result<String> {
    let encrypted_data = encrypt(data.as_bytes(), password)?;
    Ok(base64::encode_config(&encrypted_data, base64::URL_SAFE))
}

pub fn str_decrypt(encrypted_data: &str, password: &str) -> Result<String> {
    let encrypted_data = base64::decode_config(encrypted_data, base64::URL_SAFE)?;
    let data = decrypt(encrypted_data.as_slice(), password)?;
    Ok(String::from_utf8(data)?)
}

pub fn encrypt(data: &[u8], password: &str) -> Result<Vec<u8>> {
    let salt = random::alphanumeric(SALT_LEN);
    let (key, _) = pbkdf2(password.as_bytes(), &salt)?;
    let nonce = random::alphanumeric(NONCE_LEN);

    let mut encrypted_data = Aes256Gcm::new(GenericArray::from_slice(&key))
        .encrypt(GenericArray::from_slice(nonce.as_bytes()), data)?;

    encrypted_data.append(&mut nonce.as_bytes().to_vec());
    encrypted_data.append(&mut salt.as_bytes().to_vec());

    Ok(encrypted_data)
}

pub fn decrypt(encrypted_data: &[u8], password: &str) -> Result<Vec<u8>> {
    let (encrypted_data, appended_data) =
        encrypted_data.split_at(encrypted_data.len() - (SALT_LEN + NONCE_LEN));
    let (nonce, salt) = appended_data.split_at(appended_data.len() - SALT_LEN);
    let salt = str::from_utf8(&salt).unwrap();
    let (key, _) = pbkdf2(password.as_bytes(), &salt)?;

    let data = Aes256Gcm::new(GenericArray::from_slice(&key))
        .decrypt(GenericArray::from_slice(nonce), encrypted_data)?;

    Ok(data)
}

fn pbkdf2(password: &[u8], salt: &str) -> Result<(Vec<u8>, String)> {
    let password_hash = Pbkdf2.hash_password(password, salt)?;
    let hash = password_hash.hash.unwrap().as_bytes().to_vec();
    let salt = password_hash.salt.unwrap().as_str().to_owned();
    Ok((hash, salt))
}
