mod simple_broker;

use crate::auth::{Identity, Sign};
use crate::database::{entity::UserEntity, MySqlPool};
use crate::graphql::GraphqlError;
use async_graphql::{Context, Enum, ErrorExtensions, Result, ID};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::result::QueryResult;
use diesel::MysqlConnection;
pub use simple_broker::SimpleBroker;
use std::sync::{Arc, Mutex};

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum MutationType {
    Created,
    Updated,
    Deleted,
}

pub fn sign_in(user: &UserEntity, ctx: &Context<'_>) {
    let identity = Identity::from(user);
    let mut auth_proc = ctx
        .data_unchecked::<Arc<Mutex<Option<Sign>>>>()
        .lock()
        .unwrap();
    *auth_proc = Some(Sign::In(identity));
}

pub fn sign_out(ctx: &Context<'_>) {
    let mut auth_proc = ctx
        .data_unchecked::<Arc<Mutex<Option<Sign>>>>()
        .lock()
        .unwrap();
    *auth_proc = Some(Sign::Out);
}

pub fn get_identity_from_ctx(ctx: &Context<'_>) -> Option<Identity> {
    match ctx.data_opt::<Identity>() {
        Some(identity) => Some(identity.clone()),
        _ => None,
    }
}

pub fn get_conn_from_ctx(
    ctx: &Context<'_>,
) -> Result<PooledConnection<ConnectionManager<MysqlConnection>>> {
    ctx.data::<MySqlPool>().unwrap().get().map_err(|e| {
        GraphqlError::ServerError("Unable to get DB connection".into(), format!("{}", e)).extend()
    })
}

pub fn convert_id(id: &ID) -> Result<u64> {
    id.to_string().parse::<u64>().map_err(|e| {
        GraphqlError::ServerError("Failed to convert id".into(), format!("{}", e)).extend()
    })
}

pub fn convert_query_result<T>(result: QueryResult<T>, message: &str) -> Result<T> {
    result.map_err(|e| GraphqlError::ServerError(message.into(), format!("{}", e)).extend())
}
