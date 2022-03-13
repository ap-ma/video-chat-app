use crate::graphql::{common, GraphqlError};
use async_graphql::ErrorExtensions;
use async_graphql::*;

pub struct ResourceGuard<'a> {
    owner_id: &'a ID,
}

impl<'a> ResourceGuard<'a> {
    pub fn new(owner_id: &'a ID) -> Self {
        Self { owner_id: owner_id }
    }
}

#[async_trait::async_trait]
impl<'a> Guard for ResourceGuard<'a> {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        if let Some(identity) = common::get_identity_from_ctx(ctx) {
            if common::convert_id(self.owner_id)? == identity.id {
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
