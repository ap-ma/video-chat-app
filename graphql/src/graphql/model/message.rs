use crate::database::entity::MessageEntity;
use async_graphql::*;

#[derive(Default, Debug)]
pub struct Message {
    pub id: u64,
    pub tx_user_id: u64,
    pub rx_user_id: u64,
    pub category: i32,
    pub message: Option<String>,
    pub status: i32,
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
        }
    }
}

#[Object]
impl Message {
    async fn id(&self) -> u64 {
        self.id
    }

    async fn tx_user_id(&self) -> u64 {
        self.tx_user_id
    }

    async fn rx_user_id(&self) -> u64 {
        self.rx_user_id
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
}
