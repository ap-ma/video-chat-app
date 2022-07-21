use crate::graphql::common;
use crate::graphql::common::SignalType;
use crate::graphql::GraphqlError;
use async_graphql::*;

#[derive(Clone)]
pub struct Signal {
    pub call_id: u64,
    pub tx_user_id: u64,
    pub tx_user_name: Option<String>,
    pub tx_user_avatar: Option<String>,
    pub rx_user_id: u64,
    pub sdp: Option<String>,
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

    async fn tx_user_avatar(&self) -> Result<Option<String>> {
        if let Some(filename) = self.tx_user_avatar.clone() {
            let filename = common::get_avatar_file_path(&filename, self.tx_user_id);
            let signed_url = common::file_download_url(&filename).await.map_err(|e| {
                let m = "Failed to generate signed URL.";
                GraphqlError::ServerError(m.into(), e.message).extend()
            })?;
            return Ok(Some(signed_url));
        };

        Ok(None)
    }

    async fn rx_user_id(&self) -> ID {
        self.rx_user_id.into()
    }

    async fn sdp(&self) -> Option<&str> {
        self.sdp.as_deref()
    }

    async fn signal_type(&self) -> SignalType {
        self.signal_type
    }
}
