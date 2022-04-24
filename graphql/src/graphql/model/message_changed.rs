use super::{ChatHistory, Message, User};
use crate::database::service;
use crate::graphql::common::{self, MutationType};
use crate::graphql::security::auth;
use async_graphql::*;

#[derive(Clone)]
pub struct MessageChanged {
    pub tx_user_id: u64,
    pub rx_user_id: u64,
    pub message: Option<Message>,
    pub messages: Option<Vec<Message>>,
    pub mutation_type: MutationType,
}

#[Object]
impl MessageChanged {
    async fn tx_user_id(&self) -> ID {
        self.tx_user_id.into()
    }

    async fn rx_user_id(&self) -> ID {
        self.rx_user_id.into()
    }

    async fn message(&self) -> Option<Message> {
        self.message.clone()
    }

    async fn messages(&self) -> Option<Vec<Message>> {
        self.messages.clone()
    }

    async fn mutation_type(&self) -> MutationType {
        self.mutation_type
    }

    async fn tx_user(&self, ctx: &Context<'_>) -> Result<User> {
        let conn = common::get_conn(ctx)?;
        let tx_user = common::convert_query_result(
            service::find_user_by_id(self.tx_user_id, &conn),
            "Failed to get the tx_user",
        )?;

        Ok(User::from(&tx_user))
    }

    async fn rx_user(&self, ctx: &Context<'_>) -> Result<User> {
        let conn = common::get_conn(ctx)?;
        let rx_user = common::convert_query_result(
            service::find_user_by_id(self.rx_user_id, &conn),
            "Failed to get the rx_user",
        )?;

        Ok(User::from(&rx_user))
    }

    async fn latest_chat(&self, ctx: &Context<'_>) -> Result<Option<ChatHistory>> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let other_user_id = if identity.id == self.tx_user_id {
            self.rx_user_id
        } else if identity.id == self.rx_user_id {
            self.tx_user_id
        } else {
            u64::MIN
        };

        let other_user = common::convert_query_result(
            service::find_user_by_id(other_user_id, &conn),
            "Failed to get the other user",
        )?;

        let latest_message = service::get_latest_message(identity.id, other_user.id, &conn).ok();
        if let None = latest_message {
            return Ok(None);
        }

        let latest_message = latest_message.unwrap();
        let latest_chat = ChatHistory::from(&(other_user, latest_message));

        Ok(Some(latest_chat))
    }
}
