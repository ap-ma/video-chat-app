use super::Call;
use crate::constant::message as message_const;
use crate::constant::system::DEFAULT_DATETIME_FORMAT;
use crate::database::entity::{CallEntity, MessageEntity};
use crate::graphql::common;
use crate::graphql::GraphqlError;
use async_graphql::*;
use chrono::NaiveDateTime;

#[derive(Clone, Debug)]
pub struct Message {
    pub id: u64,
    pub tx_user_id: u64,
    pub rx_user_id: u64,
    pub category: i32,
    pub message: Option<String>,
    pub status: i32,
    pub created_at: NaiveDateTime,
    pub call: Option<Call>,
}

impl From<&(MessageEntity, Option<CallEntity>)> for Message {
    fn from((message, call): &(MessageEntity, Option<CallEntity>)) -> Self {
        Self {
            id: message.id,
            tx_user_id: message.tx_user_id,
            rx_user_id: message.rx_user_id,
            category: message.category,
            message: message.message.clone(),
            status: message.status,
            created_at: message.created_at,
            call: call.as_ref().map(|entity| Call::from(entity)),
        }
    }
}

#[Object]
impl Message {
    async fn id(&self) -> ID {
        self.id.into()
    }

    async fn tx_user_id(&self) -> ID {
        self.tx_user_id.into()
    }

    async fn rx_user_id(&self) -> ID {
        self.rx_user_id.into()
    }

    async fn category(&self) -> i32 {
        self.category
    }

    async fn message(&self) -> Result<Option<String>> {
        if message_const::category::IMAGE_TRANSMISSION == self.category {
            if let Some(filename) = self.message.clone() {
                let filename =
                    common::get_image_file_path(&filename, self.tx_user_id, self.rx_user_id);
                let signed_url = common::file_download_url(&filename).await.map_err(|e| {
                    let m = "Failed to generate signed URL.";
                    GraphqlError::ServerError(m.into(), e.message).extend()
                })?;

                return Ok(Some(signed_url));
            };
        };

        Ok(self.message.clone())
    }

    async fn status(&self) -> i32 {
        self.status
    }

    async fn created_at(&self, format: Option<String>) -> String {
        let f = format.unwrap_or(DEFAULT_DATETIME_FORMAT.to_owned());
        self.created_at.format(f.as_str()).to_string()
    }

    async fn call(&self) -> Option<Call> {
        self.call.clone()
    }
}
