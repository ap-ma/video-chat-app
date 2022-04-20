use super::Message;
use crate::database::entity::{ContactEntity, UserEntity};
use crate::database::service;
use crate::graphql::common;
use crate::graphql::security::auth;
use async_graphql::*;

#[derive(Clone, Debug)]
pub struct Contact {
    pub id: u64,
    pub user_id: u64,
    pub user_code: String,
    pub user_name: Option<String>,
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

    async fn user_name(&self, ctx: &Context<'_>) -> Result<Option<String>> {
        if let Some(identity) = auth::get_identity(ctx)? {
            if identity.id == self.user_id {
                let name = self.user_name.clone().map_or(String::new(), |v| v + " ");
                return Ok(Some(name + "(myself)"));
            }
        }

        Ok(self.user_name.clone())
    }

    async fn user_avatar(&self) -> Option<&str> {
        self.user_avatar.as_deref()
    }

    async fn status(&self) -> i32 {
        self.status
    }

    async fn blocked(&self) -> bool {
        self.blocked
    }

    async fn chat(
        &self,
        ctx: &Context<'_>,
        cursor: Option<u64>,
        limit: Option<i64>,
    ) -> Result<Vec<Message>> {
        if self.blocked {
            return Ok(Vec::new());
        }

        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();
        let messages = common::convert_query_result(
            service::get_messages(identity.id, self.user_id, cursor, limit, &conn),
            "Failed to get chat",
        )?;

        Ok(messages.iter().map(Message::from).collect())
    }
}
