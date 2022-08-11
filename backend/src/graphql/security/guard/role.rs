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
        match auth::get_identity(ctx) {
            Ok(identity) => {
                if Role::Guest != self.role {
                    if (identity.role == self.role) || (Role::Admin == identity.role) {
                        return Ok(());
                    }
                }
                Err(GraphqlError::AuthorizationError("Not authorized.".into()).extend())
            }
            Err(error) => {
                if GraphqlError::AuthenticationError.extend() == error {
                    if Role::Guest == self.role {
                        return Ok(());
                    }
                }
                Err(error)
            }
        }
    }
}
