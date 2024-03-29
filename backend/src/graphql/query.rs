use super::common;
use super::model::{Contact, LatestMessage, User};
use super::security::auth::{self, Role};
use super::security::guard::RoleGuard;
use super::GraphqlError;
use crate::constant::contact as contact_const;
use crate::constant::error;
use crate::database::service;
use async_graphql::*;

pub struct Query;

#[Object]
impl Query {
    async fn is_authenticated(&self, ctx: &Context<'_>) -> Result<bool> {
        match auth::get_identity(ctx) {
            Ok(_) => Ok(true),
            Err(error) => {
                if GraphqlError::AuthenticationError.extend() == error {
                    Ok(false)
                } else {
                    Err(error)
                }
            }
        }
    }

    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn is_password_reset_token_valid(
        &self,
        ctx: &Context<'_>,
        token: Option<String>,
    ) -> Result<bool> {
        let token = token.ok_or_else(|| {
            GraphqlError::ValidationError(error::V_TOKEN_NOT_ENTERED.into(), "token").extend()
        })?;

        common::get_user_by_password_reset_token(&token, ctx).and(Ok(true))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn me(&self, ctx: &Context<'_>) -> Result<User> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;
        let user = common::convert_query_result(
            service::find_user_by_id(identity.id, &conn),
            "Failed to get the user",
        )?;

        Ok(User::from(&user))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contacts(&self, ctx: &Context<'_>) -> Result<Vec<Contact>> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;
        let contacts = common::convert_query_result(
            service::get_contacts(identity.id, &conn),
            "Failed to get contacts",
        )?;

        Ok(contacts.iter().map(Contact::from).collect())
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn latest_messages(&self, ctx: &Context<'_>) -> Result<Vec<LatestMessage>> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;
        let latest_messages = common::convert_query_result(
            service::get_latest_messages_for_each_user(identity.id, &conn),
            "Failed to get latest messages",
        )?;

        Ok(latest_messages.iter().map(LatestMessage::from).collect())
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_info(
        &self,
        ctx: &Context<'_>,
        contact_user_id: Option<ID>,
    ) -> Result<Contact> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let contact_user_id = match contact_user_id {
            Some(contact_user_id) => common::convert_id(&contact_user_id)?,
            None => identity.id,
        };

        match service::find_contact_by_user_id(identity.id, contact_user_id, &conn).ok() {
            Some(contact) => Ok(Contact::from(&contact)),
            // コンタクト未登録時もチャット画面を表示
            None => {
                let other_user = common::convert_query_result(
                    service::find_user_by_id(contact_user_id, &conn),
                    "Failed to get the contact user",
                )?;

                Ok(Contact {
                    id: u64::MIN,
                    user_id: other_user.id,
                    user_code: other_user.code,
                    user_name: other_user.name,
                    user_comment: other_user.comment,
                    user_avatar: other_user.avatar,
                    status: contact_const::status::UNAPPROVED,
                    blocked: false,
                })
            }
        }
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn search_user(&self, ctx: &Context<'_>, user_code: String) -> Result<Option<User>> {
        let conn = common::get_conn(ctx)?;
        let user = common::convert_query_result(
            service::find_users_by_code(user_code.as_str(), &conn),
            "Failed to get the user",
        )?;

        Ok(user.map(|user| User::from(&user)))
    }
}
