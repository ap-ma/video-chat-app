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
        let identity = auth::get_identity(ctx)?;
        let identity = identity.ok_or_else(|| GraphqlError::AuthenticationError.extend())?;

        if identity.id != self.owner_id {
            let m = "Access to the resource is unauthorized.";
            let e = GraphqlError::AuthorizationError(m.into());
            return Err(e.extend());
        }

        Ok(())
    }
}
