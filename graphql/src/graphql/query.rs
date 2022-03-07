use super::model::{Contact, User};
use super::security::guard::RoleGuard;
use super::{get_conn_from_ctx, get_identity_from_ctx};
use crate::auth::Role;
use crate::constants::contact as contact_const;
use crate::database::service;
use async_graphql::*;

pub struct Query;

#[Object]
impl Query {
    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn me(&self, ctx: &Context<'_>) -> User {
        let conn = get_conn_from_ctx(ctx);
        let identity = get_identity_from_ctx(ctx).expect("Unable to get signed-in user");
        let user = service::find_user_by_id(identity.id, &conn).expect("Failed to get the user");
        User::from(&user)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_info(
        &self,
        ctx: &Context<'_>,
        contact_user_id: u64,
    ) -> Result<Contact, Error> {
        let conn = get_conn_from_ctx(ctx);
        let identity = get_identity_from_ctx(ctx).expect("Unable to get signed-in user");
        let contact_result = service::find_contact(identity.id, contact_user_id, &conn).ok();

        match contact_result {
            Some(contact) => Ok(Contact::from(&contact)),
            // コンタクト未登録時もチャット画面を表示
            None => match service::find_user_by_id(contact_user_id, &conn).ok() {
                Some(other_user) => Ok(Contact {
                    id: 0.into(),
                    user_id: other_user.id.into(),
                    user_code: other_user.code,
                    user_name: other_user.name,
                    user_avatar: other_user.avatar,
                    status: contact_const::status::UNAPPROVED,
                    blocked: false,
                }),
                None => Err(Error::new("Unable to get the contact user")),
            },
        }
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn search_user(&self, ctx: &Context<'_>, user_code: String) -> Vec<User> {
        let conn = get_conn_from_ctx(ctx);
        service::get_users_by_code(user_code.as_str(), &conn)
            .expect("Failed to get chat")
            .iter()
            .map(User::from)
            .collect()
    }
}
