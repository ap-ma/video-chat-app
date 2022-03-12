use crate::graphql::common;
use async_graphql::*;

pub struct ResourceGuard {
    user_id: u64,
}

impl ResourceGuard {
    pub fn new(user_id: &ID) -> Self {
        Self {
            user_id: common::convert_id(user_id),
        }
    }
}

#[async_trait::async_trait]
impl Guard for ResourceGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        if let Some(identity) = common::get_identity_from_ctx(ctx) {
            if self.user_id == identity.id {
                return Ok(());
            }
        }
        Err("Forbidden".into())
    }
}
