mod mail;
mod misc;
mod simple_broker;
mod storage;

use crate::constant::system::gcp;
use crate::database::MySqlPool;
use crate::graphql::GraphqlError;
use async_graphql::{Context, Enum, ErrorExtensions, Result, Upload, ID};
use chrono::Local;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::result::QueryResult;
use diesel::MysqlConnection;
use std::ffi::OsStr;
use std::io::Read;
use std::path::Path;

pub use mail::{builder as mail_builder, send_mail};
pub use misc::get_user_by_password_reset_token;
pub use simple_broker::SimpleBroker;
pub use storage::{file_download_url, file_upload};

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum MutationType {
    Created,
    Updated,
    Deleted,
}

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum SignalType {
    Offer,
    Answer,
    Close,
    Cancel,
}

pub fn get_conn(ctx: &Context<'_>) -> Result<PooledConnection<ConnectionManager<MysqlConnection>>> {
    ctx.data_unchecked::<MySqlPool>().get().map_err(|e| {
        GraphqlError::ServerError("Unable to get DB connection".into(), e.to_string()).extend()
    })
}

pub fn convert_query_result<T>(result: QueryResult<T>, message: &str) -> Result<T> {
    result.map_err(|e| GraphqlError::ServerError(message.into(), e.to_string()).extend())
}

pub fn convert_id(id: &ID) -> Result<u64> {
    id.to_string().parse::<u64>().map_err(|e| {
        GraphqlError::ServerError("Failed to convert id.".into(), e.to_string()).extend()
    })
}

pub fn get_upload_file_info(file: Upload, ctx: &Context<'_>) -> Result<(Vec<u8>, String, String)> {
    let file = file.value(ctx)?;

    let original_name = file.filename.clone().to_lowercase();
    let ext = Path::new(&original_name)
        .extension()
        .and_then(OsStr::to_str);
    let timestamp = Local::now()
        .naive_local()
        .format("%Y%m%d%H%M%S%f")
        .to_string();

    let filename = format!("{}.{}", timestamp, ext.unwrap_or(""));
    let content_type = file.content_type.clone().unwrap_or(String::new());
    let mut data = Vec::new();
    file.into_read().read_to_end(&mut data)?;

    Ok((data, filename, content_type))
}

pub fn get_avatar_file_path(filename: &str, user_id: u64) -> String {
    format!("{}/{}/{}", gcp::AVATAR_FILE_PREFIX, user_id, filename)
}

pub fn get_image_file_path(filename: &str, tx_user_id: u64, rx_user_id: u64) -> String {
    format!(
        "{}/{}_{}/{}",
        gcp::MESSAGE_FILE_PREFIX,
        tx_user_id,
        rx_user_id,
        filename
    )
}
