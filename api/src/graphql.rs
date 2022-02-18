pub mod auth;
pub mod form;
pub mod model;
pub mod mutation;
pub mod query;
pub mod subscription;

use crate::database::MySqlPool;
use async_graphql::{Context, EmptySubscription, Schema};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::MysqlConnection;
use mutation::Mutation;
use query::Query;
use std::sync::Arc;
use subscription::Subscription;

pub type AppSchema = Schema<Query, Mutation, EmptySubscription>;

pub fn create_schema(pool: MySqlPool) -> AppSchema {
  let pool = Arc::new(pool);
  Schema::build(Query, Mutation, EmptySubscription)
    .data(pool)
    .finish()
}

pub fn get_conn(ctx: &Context<'_>) -> PooledConnection<ConnectionManager<MysqlConnection>> {
  ctx
    .data::<MySqlPool>()
    .expect("Unable to get pool")
    .get()
    .expect("Unable to get DB connection")
}
