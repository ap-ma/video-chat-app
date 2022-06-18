use crate::constant::user::role as role_const;
use crate::database::entity::UserEntity;
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Identity {
    pub id: u64,
    pub role: Role,
}

impl From<&UserEntity> for Identity {
    fn from(user: &UserEntity) -> Self {
        Identity {
            id: user.id,
            role: Role::from(user.role),
        }
    }
}

#[derive(Eq, PartialEq, Clone, Serialize, Deserialize)]
pub enum Role {
    Admin,
    User,
    Guest,
}

impl From<i32> for Role {
    fn from(role: i32) -> Self {
        match role {
            role_const::ADMIN => Role::Admin,
            role_const::USER => Role::User,
            _ => Role::Guest,
        }
    }
}
