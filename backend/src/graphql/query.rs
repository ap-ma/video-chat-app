use super::common;
use super::model::{Contact, LatestMessage, User};
use super::security::auth::{self, Role};
use super::security::guard::RoleGuard;
use crate::constant::contact as contact_const;
use crate::database::service;
use async_graphql::*;

pub struct Query;

#[Object]
impl Query {
    async fn is_authenticated(&self, ctx: &Context<'_>) -> Result<bool> {
        match auth::get_identity(ctx)? {
            Some(_) => Ok(true),
            None => Ok(false),
        }
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn me(&self, ctx: &Context<'_>) -> Result<User> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();
        let user = common::convert_query_result(
            service::find_user_by_id(identity.id, &conn),
            "Failed to get the user",
        )?;

        Ok(User::from(&user))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contacts(&self, ctx: &Context<'_>) -> Result<Vec<Contact>> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();
        let contacts = common::convert_query_result(
            service::get_contacts(identity.id, &conn),
            "Failed to get contacts",
        )?;

        Ok(contacts.iter().map(Contact::from).collect())
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn latest_messages(&self, ctx: &Context<'_>) -> Result<Vec<LatestMessage>> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();
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
        let identity = auth::get_identity(ctx)?.unwrap();

        let contact_user_id = match contact_user_id {
            Some(contact_user_id) => common::convert_id(&contact_user_id)?,
            None => identity.id,
        };

        match service::find_contact_with_user(identity.id, contact_user_id, &conn).ok() {
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
                    user_avatar: other_user.avatar,
                    status: contact_const::status::UNAPPROVED,
                    blocked: false,
                })
            }
        }
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn search_user(&self, ctx: &Context<'_>, user_code: String) -> Result<Vec<User>> {
        let conn = common::get_conn(ctx)?;
        let users = common::convert_query_result(
            service::get_users_by_code(user_code.as_str(), &conn),
            "Failed to get user",
        )?;

        Ok(users.iter().map(User::from).collect())
    }
}
