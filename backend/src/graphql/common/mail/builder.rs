use crate::constant::system::{email_verification, password_reset, APP_NAME, FRONT_URL};
use crate::graphql::GraphqlError;
use async_graphql::{ErrorExtensions, Result};
use url::Url;

pub fn email_verification_at_create(name: &str, token: &str) -> Result<(String, String)> {
    let subject = format!("[{}] ", APP_NAME.as_str()) + "Please verify your email address.";
    let link = create_link(&email_verification::FRONT_PATH, token)?;
    let body = include_str!("./template/email_verification_at_create")
        .replace("{name}", name)
        .replace("{app_name}", APP_NAME.as_str())
        .replace("{link}", link.as_str())
        .replace(
            "{max_miutes}",
            &email_verification::LINK_MAX_MINUTES.to_string(),
        );

    Ok((subject, body))
}

pub fn email_verification_at_update(name: &str, token: &str) -> Result<(String, String)> {
    let subject = format!("[{}] ", APP_NAME.as_str()) + "Please verify your email address.";
    let link = create_link(&email_verification::FRONT_PATH, token)?;
    let body = include_str!("./template/email_verification_at_update")
        .replace("{name}", name)
        .replace("{link}", link.as_str())
        .replace(
            "{max_miutes}",
            &email_verification::LINK_MAX_MINUTES.to_string(),
        );

    Ok((subject, body))
}

pub fn forgot_password(token: &str) -> Result<(String, String)> {
    let subject = format!("[{}] ", APP_NAME.as_str()) + "Password Reset";
    let link = create_link(&password_reset::FRONT_PATH, token)?;
    let body = include_str!("./template/forgot_password")
        .replace("{link}", link.as_str())
        .replace(
            "{max_miutes}",
            &password_reset::LINK_MAX_MINUTES.to_string(),
        );

    Ok((subject, body))
}

fn create_link(path: &str, token: &str) -> Result<String> {
    let mut link = Url::parse(FRONT_URL.as_ref()).map_err(|e| {
        let m = "Invalid FRONT_URL.";
        GraphqlError::ServerError(m.into(), e.to_string()).extend()
    })?;

    link.path_segments_mut()
        .map_err(|_| {
            let m = "Invalid FRONT_URL.";
            let d = "FRONT_URL cannot be a base url.";
            GraphqlError::ServerError(m.into(), d.into()).extend()
        })?
        .pop_if_empty()
        .extend(&[path, token]);

    Ok(link.to_string())
}
