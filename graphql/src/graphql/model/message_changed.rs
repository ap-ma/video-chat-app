use super::Message;
use super::User;
use crate::database::service;
use crate::graphql::common::{self, MutationType};
use async_graphql::*;

#[derive(Clone)]
pub struct MessageChanged {
    pub id: ID,
    pub tx_user_id: ID,
    pub rx_user_id: ID,
    pub mutation_type: MutationType,
}

#[Object]
impl MessageChanged {
    async fn id(&self) -> &ID {
        &self.id
    }

    async fn tx_user_id(&self) -> &ID {
        &self.tx_user_id
    }

    async fn rx_user_id(&self) -> &ID {
        &self.rx_user_id
    }

    async fn mutation_type(&self) -> MutationType {
        self.mutation_type
    }

    async fn tx_user(&self, ctx: &Context<'_>) -> Result<User> {
        let conn = common::get_conn_from_ctx(ctx)?;
        let tx_user = common::convert_query_result(
            service::find_user_by_id(common::convert_id(&self.tx_user_id)?, &conn),
            "Failed to get the tx_user",
        )?;

        Ok(User::from(&tx_user))
    }

    async fn message(&self, ctx: &Context<'_>) -> Result<Option<Message>> {
        let conn = common::get_conn_from_ctx(ctx)?;
        let message = match service::find_message_by_id(common::convert_id(&self.id)?, &conn) {
            Ok(message_eneity) => Some(Message::from(&message_eneity)),
            _ => None,
        };
        Ok(message)
    }
}
