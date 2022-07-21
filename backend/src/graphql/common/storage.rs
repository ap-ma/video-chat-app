use crate::constant::system::gcp;
use async_graphql::{Error, Result};
use cloud_storage::Object;

pub async fn file_upload(file: Vec<u8>, filename: &str, mime_type: &str) -> Result<Object> {
    Object::create(&gcp::BUCKET_NAME, file, filename, mime_type)
        .await
        .map_err(Error::from)
}

pub async fn file_download_url(filename: &str) -> Result<String> {
    Object::read(&gcp::BUCKET_NAME, filename)
        .await?
        .download_url(*gcp::OBJECT_URL_MAX_AGE)
        .map_err(Error::from)
}
