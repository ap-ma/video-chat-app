use super::form::{SignInInput, SignUpInput};
use super::security::{password, random, RoleGuard};
use super::{get_conn_from_ctx, sign_in, sign_out};
use crate::auth::Role;
use crate::constants::{contact as contact_const, user as user_const};
use crate::database::entity::{NewContactEntity, NewUserEntity};
use crate::database::service;
use async_graphql::*;

pub struct Mutation;

#[Object]
impl Mutation {
    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn sign_up(&self, ctx: &Context<'_>, input: SignUpInput) -> Result<bool> {
        let conn = get_conn_from_ctx(ctx);
        if let Ok(_) = service::find_user_by_email(&input.email, &conn) {
            return Err(Error::new("Email has already been registered"));
        }
        if let Ok(_) = service::find_user_by_code(&input.code, &conn) {
            return Err(Error::new("Code has already been registered"));
        }

        let secret = random::gen(50);
        let password = password::hash(input.password.as_str(), &secret)
            .expect("Failed to create password hash");
        let new_user = NewUserEntity {
            code: input.code,
            name: Some(input.name),
            email: input.email,
            password,
            secret,
            comment: input.comment,
            avatar: input.avatar,
            role: user_const::role::USER,
            status: user_const::status::ACTIVE,
        };
        let user = service::create_user(new_user, &conn).expect("Failed to create user");

        let new_contact = NewContactEntity {
            user_id: user.id,
            contact_user_id: user.id,
            status: contact_const::status::APPROVED,
            blocked: false,
        };
        let _ = service::create_contact(new_contact, &conn).expect("Failed to create contact");

        sign_in(ctx, &user);

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn sign_in(&self, ctx: &Context<'_>, input: SignInInput) -> bool {
        let conn = get_conn_from_ctx(ctx);
        if let Some(user) = service::find_user_by_email(&input.email, &conn).ok() {
            if let Ok(matching) = password::verify(&user.password, &input.password, &user.secret) {
                if matching {
                    sign_in(ctx, &user);
                    return true;
                }
            }
        }
        false
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn sign_out(&self, ctx: &Context<'_>) -> bool {
        sign_out(ctx);
        true
    }
}
