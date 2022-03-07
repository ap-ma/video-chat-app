use async_graphql::*;

#[derive(InputObject)]
pub struct SignUpInput {
    #[graphql(validator(regex = "^[a-zA-Z0-9]{4,8}$"))]
    pub code: String,
    pub name: String,
    #[graphql(validator(email))]
    pub email: String,
    // 最低8文字 最大24文字 大文字、小文字、数字をそれぞれ1文字以上含む半角英数字
    #[graphql(validator(regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,24}$"))]
    pub password: String,
    // 平均4バイト想定 50文字前後
    #[graphql(validator(max_length = 200))]
    pub comment: Option<String>,
    pub avatar: Option<String>,
    pub version: i32,
}

#[derive(InputObject)]
pub struct SignInInput {
    #[graphql(validator(email))]
    pub email: String,
    // 最低8文字 最大24文字 大文字、小文字、数字をそれぞれ1文字以上含む半角英数字
    #[graphql(validator(regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,24}$"))]
    pub password: String,
}
