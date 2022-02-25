use super::form::{SignInInput, SignUpInput};
use super::model::User;
use super::security::{guard::RoleGuard, password, random};
use crate::auth::{Identity, Role, Sign};
use crate::constants::user as user_const;
use crate::database::{entity::NewUserEntity, service};
use async_graphql::*;
use std::sync::{Arc, Mutex};

pub struct Mutation;

#[Object]
impl Mutation {
  #[graphql(guard = "RoleGuard::new(Role::Guest)")]
  async fn sign_up(&self, ctx: &Context<'_>, input: SignUpInput) -> Result<User> {
    let conn = super::get_conn(ctx);
    match service::find_user_by_email(&input.email, &conn).ok() {
      Some(_) => Err(Error::new("Email has already been registered")),
      None => {
        let secret = random::gen(50);
        let password =
          password::hash(input.password.as_str(), &secret).expect("Failed to create password hash");
        let user = NewUserEntity {
          code: input.code,
          name: Some(input.name),
          email: input.email,
          password,
          secret,
          avatar: input.avatar,
          role: user_const::role::USER,
          status: user_const::status::ACTIVE,
        };
        let user = service::create_user(user, &conn).expect("Failed to create user");
        Ok(User::from(&user))
      }
    }
  }

  #[graphql(guard = "RoleGuard::new(Role::Guest)")]
  async fn sign_in(&self, ctx: &Context<'_>, input: SignInInput) -> bool {
    let conn = super::get_conn(ctx);
    let option_user = service::find_user_by_email(&input.email, &conn).ok();

    if let Some(user) = option_user {
      if let Ok(matching) = password::verify(&user.password, &input.password, &user.secret) {
        if matching {
          let identity = Identity::from(&user);
          let mut auth_proc = ctx
            .data_unchecked::<Arc<Mutex<Option<Sign>>>>()
            .lock()
            .expect("Failed to get Mutex");
          *auth_proc = Some(Sign::In(identity));
          return true;
        }
      }
    }

    false
  }

  #[graphql(guard = "RoleGuard::new(Role::User)")]
  async fn sign_out(&self, ctx: &Context<'_>) -> bool {
    let mut auth_proc = ctx
      .data_unchecked::<Arc<Mutex<Option<Sign>>>>()
      .lock()
      .expect("Failed to get Mutex");
    *auth_proc = Some(Sign::Out);
    true
  }
}
