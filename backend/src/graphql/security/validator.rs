use crate::constant::error;
use crate::constant::system::validation::{CODE_PATTERN, PASSWORD_PATTERN};
use crate::database::service;
use crate::graphql::GraphqlError;
use async_graphql::{ErrorExtensions, Result};
use diesel::mysql::MysqlConnection;
use fancy_regex::Regex;
use fast_chemail::is_valid_email;

pub fn max_length_validator(field_name: &'static str, value: &str, len: usize) -> Result<()> {
    if value.len() <= len {
        return Ok(());
    }

    Err(GraphqlError::ValidationError(error::V_MAX_LENGTH.into(), field_name).extend())
}

pub fn email_validator(
    field_name: &'static str,
    value: &str,
    conn: &MysqlConnection,
) -> Result<()> {
    if is_valid_email(value.as_ref()) {
        let user = service::find_user_by_email(value, &conn);
        if user.is_ok() {
            let e = GraphqlError::ValidationError(error::V_EMAIL_DUPLICATION.into(), field_name);
            return Err(e.extend());
        }
        return Ok(());
    }

    Err(GraphqlError::ValidationError(error::V_EMAIL_FORMAT.into(), field_name).extend())
}

pub fn password_validator(
    field_name: &'static str,
    confirm_field_name: &'static str,
    value: &str,
    confirm_value: &str,
) -> Result<()> {
    if let Ok(true) = Regex::new(PASSWORD_PATTERN).map(|re| re.is_match(value).unwrap_or(false)) {
        if value != confirm_value {
            let m = error::V_PASS_CONFIRMATION_NOT_MATCH;
            let e = GraphqlError::ValidationError(m.into(), confirm_field_name);
            return Err(e.extend());
        }
        return Ok(());
    }

    Err(GraphqlError::ValidationError(error::V_PASS_FORMAT.into(), field_name).extend())
}

pub fn code_validator(
    field_name: &'static str,
    value: &str,
    excluded_user_id: Option<u64>,
    conn: &MysqlConnection,
) -> Result<()> {
    if let Ok(true) = Regex::new(CODE_PATTERN).map(|re| re.is_match(value).unwrap_or(false)) {
        let user = service::find_user_by_code(value, excluded_user_id, &conn);
        if user.is_ok() {
            let e = GraphqlError::ValidationError(error::V_CODE_DUPLICATION.into(), field_name);
            return Err(e.extend());
        }
        return Ok(());
    }

    Err(GraphqlError::ValidationError(error::V_CODE_FORMAT.into(), field_name).extend())
}
