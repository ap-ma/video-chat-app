use async_graphql::*;

#[derive(Clone)]
pub struct IceCandidate {
    pub call_id: u64,
    pub tx_user_id: u64,
    pub rx_user_id: u64,
    pub candidates: Vec<String>,
}

#[Object]
impl IceCandidate {
    async fn call_id(&self) -> ID {
        self.call_id.into()
    }

    async fn tx_user_id(&self) -> ID {
        self.tx_user_id.into()
    }

    async fn rx_user_id(&self) -> ID {
        self.rx_user_id.into()
    }

    async fn candidates(&self) -> Vec<String> {
        self.candidates.clone()
    }
}
