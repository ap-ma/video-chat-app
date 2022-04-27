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
        match self.contact_id {
            Some(contact_id) => Some(contact_id.into()),
            _ => None,
        }
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
        let identity = auth::get_identity(ctx)?.unwrap();

        let other_user_id = if identity.id == self.tx_user_id {
            self.rx_user_id
        } else if identity.id == self.rx_user_id {
            self.tx_user_id
        } else {
            return Err(GraphqlError::ServerError(
                "Failed to get the other user id.".into(),
                "Invalid value set for tx_user_id or rx_user_id.".into(),
            )
            .extend());
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
        let latest_message = LatestMessage::from(&(other_user, latest_message));

        Ok(Some(latest_message))
    }
}
