#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate thiserror;

mod auth;
mod constants;
mod database;
mod graphql;
mod handlers;

use actix_redis::RedisSession;
use actix_web::{cookie, middleware::Logger, web::Data, App, HttpServer};
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let pool = database::get_db_pool();
    database::migration(&pool);

    let schema = graphql::create_schema(pool);

    let app_url = env::var("APP_URL").unwrap_or("0.0.0.0:8080".to_owned());
    let redis_url = env::var("REDIS_URL").unwrap_or("0.0.0.0:6379".to_owned());

    let cookie_private = cookie::Key::generate();

    HttpServer::new(move || {
        App::new()
            // redis session - tokenで認可を完結させるとDB状態と矛盾が発生する可能性があるため
            .wrap(RedisSession::new(&redis_url, cookie_private.master()))
            // enable logger
            .wrap(Logger::default())
            .app_data(Data::new(schema.clone()))
            .configure(handlers::register)
    })
    .bind(app_url)?
    .run()
    .await
}
