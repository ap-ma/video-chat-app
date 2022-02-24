use crate::auth::Role;
use crate::graphql;
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
    match graphql::get_identity(ctx) {
      Some(identity) => {
        if identity.role == self.role {
          return Ok(());
        }
      }
      None => {
        if self.role == Role::Guest {
          return Ok(());
        }
      }
    }

    Err("Forbidden".into())
  }
}
