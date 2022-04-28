mod identity;
mod remember_me;

use crate::constant::system::session::AUTHENTICATED_USER_KEY;
use crate::database::entity::UserEntity;
use crate::graphql::GraphqlError;
use crate::shared::Shared;
use actix_session::Session;
use async_graphql::{Context, ErrorExtensions, Result};

pub use identity::*;
pub use remember_me::*;

pub fn get_identity(ctx: &Context<'_>) -> Result<Option<Identity>> {
    let session = ctx.data_unchecked::<Shared<Session>>();
    match session.get::<Identity>(AUTHENTICATED_USER_KEY) {
        Ok(maybe_identity) => {
            if maybe_identity.is_none() {
                return attempt_with_remember_token(ctx);
            }
            Ok(maybe_identity)
        }
        Err(e) => {
            let m = "Failed to get session information.";
            let e = GraphqlError::ServerError(m.into(), e.to_string());
            Err(e.extend())
        }
    }
}

pub fn sign_in(user: &UserEntity, ctx: &Context<'_>) -> Result<()> {
    let session = ctx.data_unchecked::<Shared<Session>>();
    match session.insert(AUTHENTICATED_USER_KEY, &Identity::from(user)) {
        Ok(()) => Ok(session.renew()),
        Err(e) => {
            let m = "Failed to initiate session.";
            let e = GraphqlError::ServerError(m.into(), e.to_string());
            Err(e.extend())
        }
    }
}

pub fn sign_out(ctx: &Context<'_>) -> Result<()> {
    let session = ctx.data_unchecked::<Shared<Session>>();
    match get_identity(ctx)? {
        Some(_) => {
            purge_remember_token(ctx)?;
            Ok(session.purge())
        }
        None => Ok(()),
    }
}
