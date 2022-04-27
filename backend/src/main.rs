#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate thiserror;

mod constant;
mod database;
mod graphql;
mod handler;
mod structure;

use actix_cors::Cors;
use actix_session::{storage::RedisActorSessionStore, SessionMiddleware};
use actix_web::{cookie, middleware::Logger, web::Data, App, HttpServer};
use constant::system::{
    API_URL, APP_ADDR, APP_DOMAIN, CORS_MAX_AGE, DATABASE_URL, FRONT_URL, REDIS_URL,
};

pub use structure::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let pool = database::get_db_pool(DATABASE_URL.as_str());
    database::migration(&pool);
    let schema = graphql::create_schema(pool);
    let cookie_private = cookie::Key::generate();

    HttpServer::new(move || {
        App::new()
            .wrap(
                // session - tokenで認可を完結させるとDB状態と矛盾が発生する可能性があるため
                SessionMiddleware::builder(
                    RedisActorSessionStore::new(REDIS_URL.as_str()),
                    cookie_private.clone(),
                )
                .cookie_domain(Some(APP_DOMAIN.clone()))
                .build(),
            )
            .wrap(
                // cors - フロントサーバーをoriginとするリクエストを許可
                Cors::default()
                    .allowed_origin(API_URL.as_str())
                    .allowed_origin(FRONT_URL.as_str())
                    .allow_any_method()
                    .allow_any_header()
                    .supports_credentials()
                    .max_age(*CORS_MAX_AGE),
            )
            // enable logger
            .wrap(Logger::default())
            .app_data(Data::new(schema.clone()))
            .configure(handler::register)
    })
    .bind(APP_ADDR.as_str())?
    .run()
    .await
}
