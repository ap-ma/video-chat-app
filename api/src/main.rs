#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;

mod constants;
mod database;
mod graphql;
mod handlers;

use actix_web::{web::Data, App, HttpServer};
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  dotenv::dotenv().ok();

  let app_addr = env::var("APP_ADDR").expect("Unable to get APP_ADDR");

  let pool = database::get_db_pool();
  database::migration(&pool);

  let schema = graphql::create_schema(pool);

  HttpServer::new(move || {
    App::new()
      .app_data(Data::new(schema.clone()))
      .configure(handlers::register)
  })
  .bind(app_addr.as_str())?
  .run()
  .await
}
