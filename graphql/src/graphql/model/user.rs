use super::super::{convert_id, get_conn_from_ctx};
use super::{Contact, Log};
use crate::database::entity::UserEntity;
use crate::database::service;
use crate::graphql::security::guard::ResourceGuard;
use async_graphql::*;

#[derive(Default, Debug)]
pub struct User {
    pub id: ID,
    pub code: String,
    pub name: Option<String>,
    pub email: String,
    pub comment: Option<String>,
    pub avatar: Option<String>,
}

impl From<&UserEntity> for User {
    fn from(entity: &UserEntity) -> Self {
        Self {
            id: entity.id.into(),
            code: entity.code.clone(),
            name: entity.name.clone(),
            email: entity.email.clone(),
            comment: entity.comment.clone(),
            avatar: entity.avatar.clone(),
        }
    }
}

#[Object]
impl User {
    async fn id(&self) -> &ID {
        &self.id
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

    async fn comment(&self) -> Option<&str> {
        self.comment.as_deref()
    }

    async fn avatar(&self) -> Option<&str> {
        self.avatar.as_deref()
    }

    #[graphql(guard = "ResourceGuard::new(&self.id)")]
    async fn contacts(&self, ctx: &Context<'_>) -> Vec<Contact> {
        let conn = get_conn_from_ctx(ctx);
        service::get_contacts(convert_id(&self.id), &conn)
            .expect("Failed to get the user's contacts")
            .iter()
            .map(Contact::from)
            .collect()
    }

    #[graphql(guard = "ResourceGuard::new(&self.id)")]
    async fn log(&self, ctx: &Context<'_>) -> Vec<Log> {
        let conn = get_conn_from_ctx(ctx);
        service::get_latest_messages_for_each_user(convert_id(&self.id), &conn)
            .expect("Failed to get Log")
            .iter()
            .map(Log::from)
            .collect()
    }
}
