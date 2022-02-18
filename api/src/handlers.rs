use crate::graphql::AppSchema;
use actix_web::{guard, web, HttpRequest, HttpResponse, Result};
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::Schema;
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse, GraphQLSubscription};

pub fn register(config: &mut web::ServiceConfig) {
  config.service(
    web::resource("/")
      .route(web::get().to(playground))
      .route(web::post().to(graphql))
      .route(
        web::get()
          .guard(guard::Header("upgrade", "websocket"))
          .to(subscription),
      ),
  );
}

async fn graphql(
  schema: web::Data<AppSchema>,
  http_request: HttpRequest,
  graph_request: GraphQLRequest,
) -> GraphQLResponse {
  schema.execute(graph_request.into_inner()).await.into()
}

async fn subscription(
  schema: web::Data<AppSchema>,
  request: HttpRequest,
  payload: web::Payload,
) -> Result<HttpResponse> {
  GraphQLSubscription::new(Schema::clone(&*schema)).start(&request, payload)
}

async fn playground() -> HttpResponse {
  HttpResponse::Ok()
    .content_type("text/html; charset=utf-8")
    .body(playground_source(
      GraphQLPlaygroundConfig::new("/").subscription_endpoint("/"),
    ))
}
