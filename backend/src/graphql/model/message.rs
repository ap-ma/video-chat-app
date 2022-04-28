use crate::database::entity::MessageEntity;
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
}

impl From<&MessageEntity> for Message {
    fn from(entity: &MessageEntity) -> Self {
        Self {
            id: entity.id,
            tx_user_id: entity.tx_user_id,
            rx_user_id: entity.rx_user_id,
            category: entity.category,
            message: entity.message.clone(),
            status: entity.status,
            created_at: entity.created_at,
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

    async fn message(&self) -> Option<&str> {
        self.message.as_deref()
    }

    async fn status(&self) -> i32 {
        self.status
    }

    async fn created_at(&self, format: Option<String>) -> String {
        let format = format.unwrap_or("%m/%d/%Y %H:%M:%S".to_owned());
        self.created_at.format(format.as_str()).to_string()
    }
}
