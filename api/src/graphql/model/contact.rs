use async_graphql::*;

/// Contact
#[derive(Default, Debug)]
pub struct Contact {
    pub id: i64,
    pub code: String,
    pub name: String,
    pub email: String,
    pub password: String,
    pub avatar: String,
    pub status: i32,
    pub created_at: String,
    pub updated_at: String,
    pub version: i32,
}
