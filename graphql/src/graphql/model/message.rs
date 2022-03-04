use crate::database::entity::MessageEntity;
use async_graphql::*;

#[derive(Default, Debug)]
pub struct Message {
    pub id: ID,
    pub tx_user_id: ID,
    pub rx_user_id: ID,
    pub category: i32,
    pub message: Option<String>,
    pub status: i32,
}

impl From<&MessageEntity> for Message {
    fn from(entity: &MessageEntity) -> Self {
        Self {
            id: entity.id.into(),
            tx_user_id: entity.tx_user_id.into(),
            rx_user_id: entity.rx_user_id.into(),
            category: entity.category,
            message: entity.message.clone(),
            status: entity.status,
        }
    }
}

#[Object]
impl Message {
    async fn id(&self) -> &ID {
        &self.id
    }

    async fn tx_user_id(&self) -> &ID {
        &self.tx_user_id
    }

    async fn rx_user_id(&self) -> &ID {
        &self.rx_user_id
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
