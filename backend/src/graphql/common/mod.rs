mod mail;
mod misc;
mod simple_broker;

use crate::database::MySqlPool;
use crate::graphql::GraphqlError;
use async_graphql::{Context, Enum, ErrorExtensions, Result, ID};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::result::QueryResult;
use diesel::MysqlConnection;

pub use mail::{builder as mail_builder, send_mail};
pub use misc::get_user_by_password_reset_token;
pub use simple_broker::SimpleBroker;

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum MutationType {
    Created,
    Updated,
    Deleted,
}

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum SignalType {
    Offer,
    Answer,
    Close,
    Cancel,
    Candidate,
}

pub fn get_conn(ctx: &Context<'_>) -> Result<PooledConnection<ConnectionManager<MysqlConnection>>> {
    ctx.data_unchecked::<MySqlPool>().get().map_err(|e| {
        GraphqlError::ServerError("Unable to get DB connection".into(), e.to_string()).extend()
    })
}

pub fn convert_query_result<T>(result: QueryResult<T>, message: &str) -> Result<T> {
    result.map_err(|e| GraphqlError::ServerError(message.into(), e.to_string()).extend())
}

pub fn convert_id(id: &ID) -> Result<u64> {
    id.to_string().parse::<u64>().map_err(|e| {
        GraphqlError::ServerError("Failed to convert id.".into(), e.to_string()).extend()
    })
}
