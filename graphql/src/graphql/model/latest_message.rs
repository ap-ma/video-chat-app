use crate::database::entity::{LatestMessageEntity, MessageEntity, UserEntity};
use async_graphql::*;

#[derive(Clone, Debug)]
pub struct LatestMessage {
    pub user_id: u64,
    pub user_code: String,
    pub user_name: Option<String>,
    pub user_avatar: Option<String>,
    pub message_id: u64,
    pub message_category: i32,
    pub message: Option<String>,
    pub message_status: i32,
}

impl From<&LatestMessageEntity> for LatestMessage {
    fn from(entity: &LatestMessageEntity) -> Self {
        Self {
            user_id: entity.user_id,
            user_code: entity.user_code.clone(),
            user_name: entity.user_name.clone(),
            user_avatar: entity.user_avatar.clone(),
            message_id: entity.message_id,
            message_category: entity.message_category,
            message: entity.message.clone(),
            message_status: entity.message_status,
        }
    }
}

impl From<&(UserEntity, MessageEntity)> for LatestMessage {
    fn from((user, message): &(UserEntity, MessageEntity)) -> Self {
        Self {
            user_id: user.id,
            user_code: user.code.clone(),
            user_name: user.name.clone(),
            user_avatar: user.avatar.clone(),
            message_id: message.id,
            message_category: message.category,
            message: message.message.clone(),
            message_status: message.status,
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

    async fn user_avatar(&self) -> Option<&str> {
        self.user_avatar.as_deref()
    }

    async fn message_id(&self) -> ID {
        self.message_id.into()
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
}
