use async_graphql::*;

#[derive(InputObject)]
pub struct SignInInput {
    pub email: String,
    pub password: String,
}

#[derive(InputObject)]
pub struct UserInput {
    pub code: String,
    pub name: String,
    pub email: String,
    pub password: String,
    pub avatar: String,
    pub version: i32,
}
