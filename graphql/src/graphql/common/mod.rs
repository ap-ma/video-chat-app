mod simple_broker;

use crate::database::MySqlPool;
use crate::graphql::GraphqlError;
use async_graphql::{Context, Enum, ErrorExtensions, Result, ID};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::result::QueryResult;
use diesel::MysqlConnection;
pub use simple_broker::SimpleBroker;

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum MutationType {
    Created,
    Updated,
    Deleted,
}

pub fn get_conn(ctx: &Context<'_>) -> Result<PooledConnection<ConnectionManager<MysqlConnection>>> {
    ctx.data::<MySqlPool>().unwrap().get().map_err(|e| {
        GraphqlError::ServerError("Unable to get DB connection".into(), format!("{}", e)).extend()
    })
}

pub fn convert_query_result<T>(result: QueryResult<T>, message: &str) -> Result<T> {
    result.map_err(|e| GraphqlError::ServerError(message.into(), format!("{}", e)).extend())
}

pub fn convert_id(id: &ID) -> Result<u64> {
    id.to_string().parse::<u64>().map_err(|e| {
        GraphqlError::ServerError("Failed to convert id".into(), format!("{}", e)).extend()
    })
}
