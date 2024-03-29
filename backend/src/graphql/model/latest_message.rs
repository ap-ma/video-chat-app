use super::Call;
use crate::constant::{message as message_const, system::DEFAULT_DATETIME_FORMAT};
use crate::database::entity::{CallEntity, LatestMessageEntity, MessageEntity, UserEntity};
use crate::database::service;
use crate::graphql::common;
use crate::graphql::security::auth;
use crate::graphql::GraphqlError;
use async_graphql::*;
use chrono::NaiveDateTime;

#[derive(Clone, Debug)]
pub struct LatestMessage {
    pub user_id: u64,
    pub user_code: String,
    pub user_name: Option<String>,
    pub user_avatar: Option<String>,
    pub message_id: u64,
    pub tx_user_id: u64,
    pub message_category: i32,
    pub message: Option<String>,
    pub message_status: i32,
    pub created_at: NaiveDateTime,
    pub call: Option<Call>,
}

impl From<&LatestMessageEntity> for LatestMessage {
    fn from(entity: &LatestMessageEntity) -> Self {
        Self {
            user_id: entity.user_id,
            user_code: entity.user_code.clone(),
            user_name: entity.user_name.clone(),
            user_avatar: entity.user_avatar.clone(),
            message_id: entity.message_id,
            tx_user_id: entity.tx_user_id,
            message_category: entity.message_category,
            message: entity.message.clone(),
            message_status: entity.message_status,
            created_at: entity.created_at.clone(),
            call: entity.call_id.and_then(|id| {
                Some(Call {
                    id,
                    message_id: entity.message_id,
                    status: entity.call_status.unwrap(),
                    started_at: entity.call_started_at,
                    ended_at: entity.call_ended_at,
                })
            }),
        }
    }
}

impl From<&(UserEntity, MessageEntity, Option<CallEntity>)> for LatestMessage {
    fn from((user, message, call): &(UserEntity, MessageEntity, Option<CallEntity>)) -> Self {
        Self {
            user_id: user.id,
            user_code: user.code.clone(),
            user_name: user.name.clone(),
            user_avatar: user.avatar.clone(),
            message_id: message.id,
            tx_user_id: message.tx_user_id,
            message_category: message.category,
            message: message.message.clone(),
            message_status: message.status,
            created_at: message.created_at.clone(),
            call: call.as_ref().map(|entity| Call::from(entity)),
        }
    }
}

#[Object]
impl LatestMessage {
    async fn user_id(&self) -> ID {
        self.user_id.into()
    }

    async fn user_code(&self) -> &str {
        self.user_code.as_str()
    }

    async fn user_name(&self) -> Option<&str> {
        self.user_name.as_deref()
    }

    async fn user_avatar(&self) -> Result<Option<String>> {
        if let Some(filename) = self.user_avatar.clone() {
            let filename = common::get_avatar_file_path(&filename, self.user_id);
            let signed_url = common::file_download_url(&filename).await.map_err(|e| {
                let m = "Failed to generate signed URL.";
                GraphqlError::ServerError(m.into(), e.message).extend()
            })?;
            return Ok(Some(signed_url));
        };

        Ok(None)
    }

    async fn message_id(&self) -> ID {
        self.message_id.into()
    }

    async fn tx_user_id(&self) -> ID {
        self.tx_user_id.into()
    }

    async fn message_category(&self) -> i32 {
        self.message_category
    }

    async fn message(&self) -> Option<&str> {
        self.message.as_deref()
    }

    async fn message_status(&self) -> i32 {
        self.message_status
    }

    async fn created_at(&self, format: Option<String>) -> String {
        let f = format.unwrap_or(DEFAULT_DATETIME_FORMAT.to_owned());
        self.created_at.format(f.as_str()).to_string()
    }

    async fn unread_message_count(&self, ctx: &Context<'_>) -> Result<i64> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        if self.tx_user_id == identity.id || message_const::status::READ == self.message_status {
            return Ok(0);
        }

        let unread_message_count = common::convert_query_result(
            service::get_unread_message_count(identity.id, self.user_id, &conn),
            "Failed to get unread message count",
        )?;

        Ok(unread_message_count)
    }

    async fn call(&self) -> Option<Call> {
        self.call.clone()
    }
}
