use crate::database::entity::ContactEntity;
use async_graphql::*;

/// Contact
#[derive(Default, Debug)]
pub struct Contact {
    pub id: u64,
    pub user_id: u64,
    pub contact_user_id: u64,
    pub status: i32,
}

impl From<&ContactEntity> for Contact {
    fn from(entity: &ContactEntity) -> Self {
        Self {
            id: entity.id,
            user_id: entity.user_id,
            contact_user_id: entity.contact_user_id,
            status: entity.status,
        }
    }
}

#[Object]
impl Contact {
    async fn id(&self) -> u64 {
        self.id
    }

    async fn user_id(&self) -> u64 {
        self.user_id
    }

    async fn contact_user_id(&self) -> u64 {
        self.contact_user_id
    }

    async fn status(&self) -> i32 {
        self.status
    }
}
