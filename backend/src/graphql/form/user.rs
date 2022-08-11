use async_graphql::*;

#[derive(InputObject)]
pub struct SignInInput {
    pub email: String,
    pub password: String,
    pub remember_me: Option<bool>,
}

#[derive(InputObject)]
pub struct SignUpInput {
    pub code: String,
    pub name: String,
    pub email: String,
    pub password: String,
    pub password_confirm: String,
    pub comment: Option<String>,
    pub avatar: Option<Upload>,
}

#[derive(InputObject)]
pub struct EditProfileInput {
    pub code: String,
    pub name: String,
    pub comment: Option<String>,
    pub avatar: Option<Upload>,
    pub is_avatar_edited: Option<bool>,
}

#[derive(InputObject)]
pub struct ChangePasswordInput {
    pub password: String,
    pub new_password: String,
    pub new_password_confirm: String,
}

#[derive(InputObject)]
pub struct ResetPasswordInput {
    pub token: String,
    pub password: String,
    pub password_confirm: String,
}
