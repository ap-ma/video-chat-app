use crate::graphql::{security::auth, GraphqlError};
use async_graphql::ErrorExtensions;
use async_graphql::*;

pub struct ResourceGuard {
    owner_id: u64,
}

impl ResourceGuard {
    pub fn new(owner_id: u64) -> Self {
        Self { owner_id: owner_id }
    }
}

#[async_trait::async_trait]
impl Guard for ResourceGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        if let Some(identity) = auth::get_identity(ctx)? {
            if self.owner_id == identity.id {
                return Ok(());
            }

            return Err(GraphqlError::AuthorizationError(
                "Access to the resource is unauthorized.".into(),
            )
            .extend());
        }

        Err(GraphqlError::AuthenticationError.extend())
    }
}
