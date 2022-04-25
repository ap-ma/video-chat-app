mod identity;

use crate::database::entity::UserEntity;
use crate::graphql::GraphqlError;
use crate::shared::Shared;
use actix_session::Session;
use async_graphql::{Context, ErrorExtensions, Result};
pub use identity::*;

const SESSION_USER_KEY: &str = "___authenticated_user";

pub fn get_identity(ctx: &Context<'_>) -> Result<Option<Identity>> {
    let session = ctx.data_unchecked::<Shared<Session>>();
    match session.get::<Identity>(SESSION_USER_KEY) {
        Ok(identity) => Ok(identity),
        Err(e) => Err(GraphqlError::ServerError(
            "Failed to get session information.".into(),
            format!("{}", e),
        )
        .extend()),
    }
}

pub fn sign_in(user: &UserEntity, ctx: &Context<'_>) -> Result<()> {
    let session = ctx.data_unchecked::<Shared<Session>>();
    match session.insert(SESSION_USER_KEY, &Identity::from(user)) {
        Ok(()) => Ok(session.renew()),
        Err(e) => Err(GraphqlError::ServerError(
            "Failed to initiate session.".into(),
            format!("{}", e),
        )
        .extend()),
    }
}

pub fn sign_out(ctx: &Context<'_>) -> Result<()> {
    let session = ctx.data_unchecked::<Shared<Session>>();
    match get_identity(ctx)? {
        Some(_) => Ok(session.purge()),
        None => Ok(()),
    }
}
