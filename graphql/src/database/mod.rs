pub mod entity;
pub mod schema;
pub mod service;

use diesel::mysql::MysqlConnection;
use diesel::r2d2::{ConnectionManager, Pool};
use std::env;

embed_migrations!();

pub type MySqlPool = Pool<ConnectionManager<MysqlConnection>>;

pub fn get_db_pool() -> MySqlPool {
    let db_url = env::var("DATABASE_URL").expect("Unable to get DATABASE_URL");
    let manager = ConnectionManager::<MysqlConnection>::new(db_url);
    Pool::new(manager).expect("Failed to create pool")
}

pub fn migration(pool: &MySqlPool) {
    let conn = &pool.get().expect("Unable to get DB connection");
    diesel_migrations::run_pending_migrations(conn).expect("Failed to run DB migrations");
}
