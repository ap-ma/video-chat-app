use super::{LatestMessage, Message};
use crate::database::service;
use crate::graphql::common::{self, MutationType};
use crate::graphql::security::auth;
use crate::graphql::GraphqlError;
use async_graphql::*;

#[derive(Clone)]
pub struct MessageChanged {
    pub tx_user_id: u64,
    pub rx_user_id: u64,
    pub contact_id: Option<u64>,
    pub contact_status: Option<i32>,
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

    async fn contact_id(&self) -> Option<ID> {
        self.contact_id.map(|contact_id| contact_id.into())
    }

    async fn contact_status(&self) -> Option<i32> {
        self.contact_status.clone()
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

    async fn latest_message(&self, ctx: &Context<'_>) -> Result<Option<LatestMessage>> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let other_user_id = if identity.id == self.tx_user_id {
            self.rx_user_id
        } else if identity.id == self.rx_user_id {
            self.tx_user_id
        } else {
            let m = "Failed to get the other user id.";
            let d = "Invalid value set for tx_user_id or rx_user_id.";
            let e = GraphqlError::ServerError(m.into(), d.into());
            return Err(e.extend());
        };

        let other_user = common::convert_query_result(
            service::find_user_by_id(other_user_id, &conn),
            "Failed to get the other user",
        )?;

        let latest_message = service::get_latest_message(identity.id, other_user.id, &conn).ok();
        let latest_message =
            latest_message.map(|(message, call)| LatestMessage::from(&(other_user, message, call)));

        Ok(latest_message)
    }
}
