mod common;
mod form;
mod model;
mod mutation;
mod query;
mod security;
mod subscription;

use crate::auth::Identity;
use crate::database::MySqlPool;
use async_graphql::{Context, Schema, ID};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::MysqlConnection;
use mutation::Mutation;
use query::Query;
use subscription::Subscription;

pub type AppSchema = Schema<Query, Mutation, Subscription>;

pub fn create_schema(pool: MySqlPool) -> AppSchema {
    Schema::build(Query, Mutation, Subscription)
        .data(pool)
        .finish()
}

fn get_identity_from_ctx(ctx: &Context<'_>) -> Option<Identity> {
    match ctx.data_opt::<Identity>() {
        Some(identity) => Some(identity.clone()),
        _ => None,
    }
}

fn get_conn_from_ctx(ctx: &Context<'_>) -> PooledConnection<ConnectionManager<MysqlConnection>> {
    ctx.data::<MySqlPool>()
        .expect("Unable to get pool")
        .get()
        .expect("Unable to get DB connection")
}

fn convert_id(id: &ID) -> u64 {
    id.to_string().parse::<u64>().expect("Failed to convert id")
}
