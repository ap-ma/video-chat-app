use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Claims {
    pub user_id: u64,
    pub token: String,
}
