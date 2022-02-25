use async_graphql::*;

#[derive(InputObject)]
pub struct SignUpInput {
    pub code: String,
    pub name: String,
    #[graphql(validator(email))]
    pub email: String,
    // 最低8文字 最大24文字 大文字、小文字をそれぞれ1文字以上含む半角英数字
    #[graphql(validator(regex = "(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,24}"))]
    pub password: String,
    pub avatar: Option<String>,
    pub version: i32,
}

#[derive(InputObject)]
pub struct SignInInput {
    #[graphql(validator(email))]
    pub email: String,
    // 最低8文字 最大24文字 大文字、小文字をそれぞれ1文字以上含む半角英数字
    #[graphql(validator(regex = "(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,24}"))]
    pub password: String,
}
