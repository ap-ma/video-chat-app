mod remember_me;

use crate::constant::system::session::AUTHENTICATED_USER_KEY;
use crate::graphql::GraphqlError;
use crate::shared::Shared;
use actix_session::Session;
use async_graphql::{Context, ErrorExtensions, Result};

pub use crate::identity::*;
pub use remember_me::*;

pub fn sign_in(identity: &Identity, ctx: &Context<'_>) -> Result<()> {
    let session = ctx.data_unchecked::<Shared<Session>>();
    match session.insert(AUTHENTICATED_USER_KEY, identity) {
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
    match get_identity_from_session(ctx)? {
        Some(_) => {
            remember_me::purge_remember_token(ctx)?;
            Ok(session.purge())
        }
        None => Ok(()),
    }
}

pub fn get_identity(ctx: &Context<'_>) -> Result<Identity> {
    if let Some(identity) = get_identity_from_session(ctx)? {
        return Ok(identity);
    }

    if let Some(identity) = get_identity_from_ctx(ctx)? {
        return Ok(identity);
    }

    Err(GraphqlError::AuthenticationError.extend())
}

fn get_identity_from_session(ctx: &Context<'_>) -> Result<Option<Identity>> {
    let session = match ctx.data::<Shared<Session>>() {
        Ok(shared_session) => shared_session,
        _ => {
            return Ok(None);
        }
    };

    match session.get::<Identity>(AUTHENTICATED_USER_KEY) {
        Ok(maybe_identity) => {
            if maybe_identity.is_none() {
                return remember_me::attempt_with_remember_token(ctx);
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

fn get_identity_from_ctx(ctx: &Context<'_>) -> Result<Option<Identity>> {
    let identity = ctx
        .data::<Option<Identity>>()
        .ok()
        .and_then(|identity| identity.clone());

    if identity.is_some() {
        return Ok(identity);
    }

    remember_me::get_identity_by_remember_token(ctx)
}
