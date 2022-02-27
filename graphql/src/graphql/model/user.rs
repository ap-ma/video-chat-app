use super::{contact::Contact, message::Message};
use crate::auth::Role;
use crate::database::entity::UserEntity;
use crate::database::service;
use crate::graphql;
use crate::graphql::security::guard::{ResourceGuard, RoleGuard};
use async_graphql::*;

#[derive(Default, Debug)]
pub struct User {
    pub id: u64,
    pub code: String,
    pub name: Option<String>,
    pub email: String,
    pub avatar: Option<String>,
}

impl From<&UserEntity> for User {
    fn from(entity: &UserEntity) -> Self {
        Self {
            id: entity.id,
            code: entity.code.clone(),
            name: entity.name.clone(),
            email: entity.email.clone(),
            avatar: entity.avatar.clone(),
        }
    }
}

#[Object]
impl User {
    async fn id(&self) -> u64 {
        self.id
    }

    async fn code(&self) -> &str {
        self.code.as_str()
    }

    async fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }

    async fn email(&self) -> &str {
        self.email.as_str()
    }

    async fn avatar(&self) -> Option<&str> {
        self.name.as_deref()
    }

    #[graphql(guard = "ResourceGuard::new(self.id)")]
    async fn contacts(&self, ctx: &Context<'_>) -> Vec<Contact> {
        let conn = graphql::get_conn(ctx);
        service::get_contacts_by_user_id(self.id, &conn)
            .expect("Failed to get the user's contacts")
            .iter()
            .map(Contact::from)
            .collect()
    }

    #[graphql(guard = "ResourceGuard::new(self.id)")]
    async fn feed(&self, ctx: &Context<'_>) -> Vec<Message> {
        let conn = graphql::get_conn(ctx);
        service::get_latest_messages_for_each_contact(self.id, &conn)
            .expect("Failed to get feed")
            .iter()
            .map(Message::from)
            .collect()
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn chat(&self, ctx: &Context<'_>) -> Vec<Message> {
        let conn = graphql::get_conn(ctx);
        let identity = graphql::get_identity(ctx).expect("Failed to get the signed in user");
        service::get_contacts_by_user_id(self.id, &conn)
            .expect("Failed to get the user's contacts")
            .iter()
            .map(Contact::from)
            .collect()
    }
}
