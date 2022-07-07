use crate::graphql::common::SignalType;
use async_graphql::*;

#[derive(Clone)]
pub struct Signal {
    pub call_id: u64,
    pub tx_user_id: u64,
    pub tx_user_name: Option<String>,
    pub tx_user_avatar: Option<String>,
    pub rx_user_id: u64,
    pub sdp: Option<String>,
    pub candidate: Option<String>,
    pub signal_type: SignalType,
}

#[Object]
impl Signal {
    async fn call_id(&self) -> ID {
        self.call_id.into()
    }

    async fn tx_user_id(&self) -> ID {
        self.tx_user_id.into()
    }

    async fn tx_user_name(&self) -> Option<&str> {
        self.tx_user_name.as_deref()
    }

    async fn tx_user_avatar(&self) -> Option<&str> {
        self.tx_user_avatar.as_deref()
    }

    async fn rx_user_id(&self) -> ID {
        self.rx_user_id.into()
    }

    async fn sdp(&self) -> Option<&str> {
        self.sdp.as_deref()
    }

    async fn candidate(&self) -> Option<&str> {
        self.candidate.as_deref()
    }

    async fn signal_type(&self) -> SignalType {
        self.signal_type
    }
}
