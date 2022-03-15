use super::{Contact, Log};
use crate::database::entity::UserEntity;
use crate::database::service;
use crate::graphql::common;
use crate::graphql::security::guard::ResourceGuard;
use async_graphql::*;

#[derive(Clone, Debug)]
pub struct User {
    pub id: u64,
    pub code: String,
    pub name: Option<String>,
    pub email: String,
    pub comment: Option<String>,
    pub avatar: Option<String>,
}

impl From<&UserEntity> for User {
    fn from(entity: &UserEntity) -> Self {
        Self {
            id: entity.id,
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
    async fn id(&self) -> ID {
        self.id.into()
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

    #[graphql(guard = "ResourceGuard::new(self.id)")]
    async fn contacts(&self, ctx: &Context<'_>) -> Result<Vec<Contact>> {
        let conn = common::get_conn(ctx)?;
        let contacts = common::convert_query_result(
            service::get_contacts(self.id, &conn),
            "Failed to get the user's contacts",
        )?;

        Ok(contacts.iter().map(Contact::from).collect())
    }

    #[graphql(guard = "ResourceGuard::new(self.id)")]
    async fn log(&self, ctx: &Context<'_>) -> Result<Vec<Log>> {
        let conn = common::get_conn(ctx)?;
        let log = common::convert_query_result(
            service::get_latest_messages_for_each_user(self.id, &conn),
            "Failed to get Log",
        )?;

        Ok(log.iter().map(Log::from).collect())
    }
}
