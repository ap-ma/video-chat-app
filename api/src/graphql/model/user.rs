use super::contact::Contact;
use crate::database::entity::UserEntity;
use async_graphql::*;

#[derive(Default, Debug)]
pub struct User {
    pub id: u64,
    pub code: String,
    pub name: Option<String>,
    pub email: String,
    pub avatar: Option<String>,
    pub version: i32,
}

impl From<&UserEntity> for User {
    fn from(entity: &UserEntity) -> Self {
        User {
            id: entity.id,
            code: entity.code.clone(),
            name: entity.name.clone(),
            email: entity.email.clone(),
            avatar: entity.avatar.clone(),
            version: entity.version,
        }
    }
}

/// links user
#[Object]
impl User {
    /// The id of the user.
    async fn id(&self) -> u64 {
        self.id
    }

    /// The code of the user.
    async fn code(&self) -> &str {
        self.code.as_str()
    }

    /// The name of the user.
    async fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }

    /// The email of the user.
    async fn email(&self) -> &str {
        self.email.as_str()
    }

    /// The avatar of the user.
    async fn avatar(&self) -> Option<&str> {
        self.name.as_deref()
    }

    /// The version of the user.
    async fn version(&self) -> i32 {
        self.version
    }
}
