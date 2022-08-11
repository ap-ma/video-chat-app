use super::{LatestMessage, Message};
use crate::database::entity::{ContactEntity, UserEntity};
use crate::database::service;
use crate::graphql::common;
use crate::graphql::security::auth;
use crate::graphql::GraphqlError;
use async_graphql::*;

#[derive(Clone, Debug)]
pub struct Contact {
    pub id: u64,
    pub user_id: u64,
    pub user_code: String,
    pub user_name: Option<String>,
    pub user_comment: Option<String>,
    pub user_avatar: Option<String>,
    pub status: i32,
    pub blocked: bool,
}

impl From<&(ContactEntity, UserEntity)> for Contact {
    fn from((contact, user): &(ContactEntity, UserEntity)) -> Self {
        Self {
            id: contact.id,
            user_id: user.id,
            user_code: user.code.clone(),
            user_name: user.name.clone(),
            user_comment: user.comment.clone(),
            user_avatar: user.avatar.clone(),
            status: contact.status,
            blocked: contact.blocked,
        }
    }
}

#[Object]
impl Contact {
    async fn id(&self) -> ID {
        self.id.into()
    }

    async fn user_id(&self) -> ID {
        self.user_id.into()
    }

    async fn user_code(&self) -> &str {
        self.user_code.as_str()
    }

    async fn user_name(&self) -> Option<&str> {
        self.user_name.as_deref()
    }

    async fn user_comment(&self) -> Option<&str> {
        self.user_comment.as_deref()
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

    async fn status(&self) -> i32 {
        self.status
    }

    async fn blocked(&self) -> bool {
        self.blocked
    }

    async fn latest_message(&self, ctx: &Context<'_>) -> Result<Option<LatestMessage>> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let contact_user = common::convert_query_result(
            service::find_user_by_id(self.user_id, &conn),
            "Failed to get the contact user",
        )?;

        let latest_message = service::get_latest_message(identity.id, contact_user.id, &conn).ok();
        let latest_message = latest_message
            .map(|(message, call)| LatestMessage::from(&(contact_user, message, call)));

        Ok(latest_message)
    }

    async fn chat_count(&self, ctx: &Context<'_>) -> Result<i64> {
        if self.blocked {
            return Ok(0);
        }

        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let count = common::convert_query_result(
            service::get_message_count(identity.id, self.user_id, &conn),
            "Failed to get chat count",
        )?;

        Ok(count)
    }

    async fn chat_date_count(&self, ctx: &Context<'_>) -> Result<i64> {
        if self.blocked {
            return Ok(0);
        }

        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let date_count = common::convert_query_result(
            service::get_message_date_count(identity.id, self.user_id, &conn),
            "Failed to get chat date count",
        )?;

        let date_count = date_count.first().map_or(0, |count| count.date_count);

        Ok(date_count)
    }

    async fn chat(
        &self,
        ctx: &Context<'_>,
        cursor: Option<ID>,
        limit: Option<i64>,
    ) -> Result<Vec<Message>> {
        if self.blocked {
            return Ok(Vec::new());
        }

        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;
        let cursor = match cursor {
            Some(cursor) => Some(common::convert_id(&cursor)?),
            _ => None,
        };

        let messages = common::convert_query_result(
            service::get_messages(identity.id, self.user_id, cursor, limit, &conn),
            "Failed to get chat",
        )?;

        Ok(messages.iter().map(Message::from).collect())
    }
}
