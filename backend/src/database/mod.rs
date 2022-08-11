pub mod entity;
pub mod schema;
pub mod service;

use diesel::mysql::MysqlConnection;
use diesel::r2d2::{ConnectionManager, Pool};

embed_migrations!();

pub type MySqlPool = Pool<ConnectionManager<MysqlConnection>>;

pub fn get_db_pool(db_url: &str) -> MySqlPool {
    let manager = ConnectionManager::<MysqlConnection>::new(db_url);
    Pool::new(manager).expect("Failed to create pool")
}

pub fn migration(pool: &MySqlPool) {
    let conn = &pool.get().expect("Unable to get DB connection");
    embedded_migrations::run(conn).expect("Failed to run DB migrations");
}
