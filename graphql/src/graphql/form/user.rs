use async_graphql::*;

#[derive(InputObject)]
pub struct SignUpInput {
    pub code: String,
    pub name: String,
    pub email: String,
    pub password: String,
    pub comment: Option<String>,
    pub avatar: Option<String>,
    pub version: i32,
}

#[derive(InputObject)]
pub struct SignInInput {
    pub email: String,
    pub password: String,
}
