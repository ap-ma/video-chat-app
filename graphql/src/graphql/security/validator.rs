use crate::database::service;
use crate::graphql::GraphqlError;
use async_graphql::{ErrorExtensions, Result};
use diesel::mysql::MysqlConnection;
use fast_chemail::is_valid_email;
use regex::Regex;

pub fn max_length_validator(field_name: &'static str, value: &str, len: usize) -> Result<()> {
    if value.len() <= len {
        return Ok(());
    }
    let message = format!(
        "{} must be no more than {} characters long.",
        field_name, len
    );
    Err(GraphqlError::ValidationError(message, field_name).extend())
}

pub fn email_validator(
    field_name: &'static str,
    value: &str,
    excluded_user_id: Option<u64>,
    conn: &MysqlConnection,
) -> Result<()> {
    if is_valid_email(value.as_ref()) {
        if let Some(_) = service::find_user_by_email(value, excluded_user_id, &conn).ok() {
            return Err(GraphqlError::ValidationError(
                "Email has already been registered".into(),
                "email",
            )
            .extend());
        }
        return Ok(());
    }
    Err(GraphqlError::ValidationError(format!("invalid {}", field_name), field_name).extend())
}

pub fn password_validator(field_name: &'static str, value: &str) -> Result<()> {
    // 最低8文字 最大24文字 大文字、小文字、数字をそれぞれ1文字以上含む半角英数字
    const PATTERN: &str = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,24}$";
    if let Ok(true) = Regex::new(PATTERN).map(|re| re.is_match(value)) {
        return Ok(());
    }
    let message = field_name.to_owned()
        + " must be 8 to 24 alphanumeric characters long, \
          including at least one uppercase letter, \
          one lowercase letter, and one number.";
    Err(GraphqlError::ValidationError(message, field_name).extend())
}

pub fn code_validator(
    field_name: &'static str,
    value: &str,
    excluded_user_id: Option<u64>,
    conn: &MysqlConnection,
) -> Result<()> {
    // 最低4文字 最大8文字 半角英数字
    const PATTERN: &str = "^[a-zA-Z0-9]{4,8}$";
    if let Ok(true) = Regex::new(PATTERN).map(|re| re.is_match(value)) {
        if let Some(_) = service::find_user_by_code(value, excluded_user_id, &conn).ok() {
            return Err(GraphqlError::ValidationError(
                "Code has already been registered".into(),
                "code",
            )
            .extend());
        }

        return Ok(());
    }

    let message = format!(
        "{} must be between 4 and 8 alphanumeric characters",
        field_name
    );
    Err(GraphqlError::ValidationError(message, field_name).extend())
}
