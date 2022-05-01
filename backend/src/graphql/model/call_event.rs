use crate::graphql::common::CallEventType;
use async_graphql::*;

#[derive(Clone)]
pub struct CallEvent {
    pub call_id: u64,
    pub tx_user_id: u64,
    pub rx_user_id: u64,
    pub data: String,
    pub event_type: CallEventType,
}

#[Object]
impl CallEvent {
    async fn call_id(&self) -> ID {
        self.call_id.into()
    }

    async fn tx_user_id(&self) -> ID {
        self.tx_user_id.into()
    }

    async fn rx_user_id(&self) -> ID {
        self.rx_user_id.into()
    }

    async fn data(&self) -> &str {
        self.data.as_str()
    }

    async fn event_type(&self) -> CallEventType {
        self.event_type
    }
}
