use crate::graphql::AppSchema;
use crate::shared::Shared;
use actix_session::Session;
use actix_web::{guard, web, HttpRequest, HttpResponse, Result};
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::Schema;
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse, GraphQLSubscription};

pub fn register(config: &mut web::ServiceConfig) {
    config.service(
        web::resource("/")
            .route(web::get().to(playground))
            .route(web::post().to(index))
            .route(
                web::get()
                    .guard(guard::Header("upgrade", "websocket"))
                    .to(subscription),
            ),
    );
}

async fn index(
    schema: web::Data<AppSchema>,
    request: GraphQLRequest,
    session: Session,
) -> GraphQLResponse {
    let session = Shared::new(session);
    schema
        .execute(request.into_inner().data(session))
        .await
        .into()
}

async fn subscription(
    schema: web::Data<AppSchema>,
    request: HttpRequest,
    session: Session,
    payload: web::Payload,
) -> Result<HttpResponse> {
    let mut data = async_graphql::Data::default();
    let session = Shared::new(session);
    data.insert(session);

    GraphQLSubscription::new(Schema::clone(&*schema))
        .with_data(data)
        .start(&request, payload)
}

async fn playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(
            GraphQLPlaygroundConfig::new("/").subscription_endpoint("/"),
        ))
}
