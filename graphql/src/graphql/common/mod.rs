mod simple_broker;

use crate::auth::{Identity, Sign};
use crate::database::{entity::UserEntity, MySqlPool};
use async_graphql::{Context, Enum, ID};
use diesel::r2d2::{ConnectionManager, PooledConnection};
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
) -> PooledConnection<ConnectionManager<MysqlConnection>> {
    ctx.data::<MySqlPool>()
        .expect("Unable to get pool")
        .get()
        .expect("Unable to get DB connection")
}

pub fn convert_id(id: &ID) -> u64 {
    id.to_string().parse::<u64>().expect("Failed to convert id")
}
