use super::auth::password;
use super::auth::role::{Role, RoleGuard};
use super::form::{SignInInput, UserInput};
use super::model::User;
use crate::constants::{role, user_status};
use crate::database::entity::NewUserEntity;
use crate::database::service;
use async_graphql::*;

pub struct Mutation;

#[Object]
impl Mutation {
  #[graphql(guard = "RoleGuard::new(Role::Guest)")]
  async fn sign_up(&self, ctx: &Context<'_>, user: UserInput) -> User {
    let user = NewUserEntity {
      code: user.code,
      name: user.name,
      email: user.email,
      password: password::hash(user.password.as_str()).expect("Unable to get password hash"),
      avatar: user.avatar,
      role: role::USER,
      status: user_status::ACTIVE,
    };

    let user = service::create_user(user, &super::get_conn(ctx)).expect("Failed to create user");

    User::from(&user)
  }

  // async fn sign_in(&self, ctx: &Context<'_>, input: SignInInput) -> Result<String, Error> {
  //   let maybe_user = repository::get_user(&input.username, &get_conn_from_ctx(ctx)).ok();

  //   if let Some(user) = maybe_user {
  //     if let Ok(matching) = verify_password(&user.hash, &input.password) {
  //       if matching {
  //         let role =
  //           AuthRole::from_str(user.role.as_str()).expect("Can't convert &str to AuthRole");
  //         return Ok(common_utils::create_token(user.username, role));
  //       }
  //     }
  //   }

  //   Err(Error::new("Can't authenticate a user"))
  // }
}
