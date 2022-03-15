use crate::graphql::security::auth::{self, Role};
use crate::graphql::GraphqlError;
use async_graphql::ErrorExtensions;
use async_graphql::*;

pub struct RoleGuard {
    role: Role,
}

impl RoleGuard {
    pub fn new(role: Role) -> Self {
        Self { role }
    }
}

#[async_trait::async_trait]
impl Guard for RoleGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        match auth::get_identity(ctx)? {
            Some(identity) => {
                if self.role != Role::Guest {
                    if (identity.role == self.role) || (identity.role == Role::Admin) {
                        return Ok(());
                    }
                }
                Err(GraphqlError::AuthorizationError("Not authorized.".into()).extend())
            }
            None => {
                if self.role == Role::Guest {
                    return Ok(());
                }
                Err(GraphqlError::AuthenticationError.extend())
            }
        }
    }
}
