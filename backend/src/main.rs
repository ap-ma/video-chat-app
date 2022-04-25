#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
#[macro_use]
extern crate thiserror;

mod constants;
mod database;
mod graphql;
mod handlers;
mod shared;

use actix_cors::Cors;
use actix_session::{storage::RedisActorSessionStore, SessionMiddleware};
use actix_web::{cookie, middleware::Logger, web::Data, App, HttpServer};
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let app_addr = env::var("APP_ADDR").expect("Unable to get APP_ADDR");
    let app_domain = env::var("APP_DOMAIN").expect("Unable to get APP_DOMAIN");
    let api_url = env::var("API_URL").expect("Unable to get API_URL");
    let front_url = env::var("FRONT_URL").expect("Unable to get FRONT_URL");
    let redis_url = env::var("REDIS_URL").expect("Unable to get REDIS_URL");
    let db_url = env::var("DATABASE_URL").expect("Unable to get DATABASE_URL");
    let cors_max_age = env::var("CORS_MAX_AGE")
        .expect("Unable to get CORS_MAX_AGE")
        .parse::<usize>()
        .expect("CORS_MAX_AGE is invalid");

    let pool = database::get_db_pool(db_url.as_ref());
    database::migration(&pool);

    let schema = graphql::create_schema(pool);

    let cookie_private = cookie::Key::generate();

    HttpServer::new(move || {
        App::new()
            .wrap(
                // session - tokenで認可を完結させるとDB状態と矛盾が発生する可能性があるため
                SessionMiddleware::builder(
                    RedisActorSessionStore::new(&redis_url),
                    cookie_private.clone(),
                )
                .cookie_domain(Some(app_domain.clone()))
                .build(),
            )
            .wrap(
                // cors - フロントサーバーをoriginとするリクエストを許可
                Cors::default()
                    .allowed_origin(api_url.as_ref())
                    .allowed_origin(front_url.as_ref())
                    .allow_any_method()
                    .allow_any_header()
                    .supports_credentials()
                    .max_age(cors_max_age),
            )
            // enable logger
            .wrap(Logger::default())
            .app_data(Data::new(schema.clone()))
            .configure(handlers::register)
    })
    .bind(app_addr)?
    .run()
    .await
}
