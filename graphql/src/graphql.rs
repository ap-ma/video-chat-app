pub mod form;
pub mod model;
pub mod mutation;
pub mod query;
pub mod security;
pub mod subscription;

use crate::auth::Identity;
use crate::database::MySqlPool;
use async_graphql::{Context, EmptySubscription, Schema};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::MysqlConnection;
use mutation::Mutation;
use query::Query;
use subscription::Subscription;

pub type AppSchema = Schema<Query, Mutation, EmptySubscription>;

pub fn create_schema(pool: MySqlPool) -> AppSchema {
    Schema::build(Query, Mutation, EmptySubscription)
        .data(pool)
        .finish()
}

fn get_identity(ctx: &Context<'_>) -> Option<Identity> {
    match ctx.data_opt::<Identity>() {
        Some(identity) => Some(identity.clone()),
        _ => None,
    }
}

fn get_conn(ctx: &Context<'_>) -> PooledConnection<ConnectionManager<MysqlConnection>> {
    ctx.data::<MySqlPool>()
        .expect("Unable to get pool")
        .get()
        .expect("Unable to get DB connection")
}
