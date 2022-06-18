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
        let identity = auth::get_identity_from_session(ctx)?;

        match identity {
            Some(identity) => {
                if Role::Guest != self.role {
                    if (identity.role == self.role) || (Role::Admin == identity.role) {
                        return Ok(());
                    }
                }
                Err(GraphqlError::AuthorizationError("Not authorized.".into()).extend())
            }
            None => {
                if Role::Guest == self.role {
                    return Ok(());
                }
                Err(GraphqlError::AuthenticationError.extend())
            }
        }
    }
}
