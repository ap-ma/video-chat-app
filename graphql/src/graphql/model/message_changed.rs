use super::Message;
use super::User;
use crate::database::service;
use crate::graphql::common::{self, MutationType};
use async_graphql::*;

#[derive(Clone)]
pub struct MessageChanged {
    pub id: u64,
    pub tx_user_id: u64,
    pub rx_user_id: u64,
    pub status: i32,
    pub mutation_type: MutationType,
}

#[Object]
impl MessageChanged {
    async fn id(&self) -> ID {
        self.id.into()
    }

    async fn tx_user_id(&self) -> ID {
        self.tx_user_id.into()
    }

    async fn rx_user_id(&self) -> ID {
        self.rx_user_id.into()
    }

    async fn status(&self) -> i32 {
        self.status
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

    async fn message(&self, ctx: &Context<'_>) -> Result<Option<Message>> {
        let conn = common::get_conn(ctx)?;
        let message = match service::find_message_by_id(self.id, &conn) {
            Ok(message_eneity) => Some(Message::from(&message_eneity)),
            _ => None,
        };
        Ok(message)
    }
}
