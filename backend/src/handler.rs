use crate::constant::system::session::AUTHENTICATED_USER_KEY;
use crate::graphql::AppSchema;
use crate::identity::Identity;
use crate::remember_token::RememberToken;
use crate::shared::Shared;
use actix_session::Session;
use actix_web::{guard, web, HttpRequest, HttpResponse, Result};
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::Schema;
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse, GraphQLSubscription};

pub fn register(config: &mut web::ServiceConfig) {
    config.service(
        web::resource("/")
            .route(web::post().to(index))
            .route(
                web::get()
                    .guard(guard::Header("upgrade", "websocket"))
                    .to(subscription),
            )
            .route(web::get().to(playground)),
    );
}

async fn index(
    schema: web::Data<AppSchema>,
    http_req: HttpRequest,
    gql_req: GraphQLRequest,
    session: Session,
) -> GraphQLResponse {
    let session = Shared::new(session);
    let remember_token = RememberToken::new(&http_req);
    let query = gql_req.into_inner().data(session).data(remember_token);
    schema.execute(query).await.into()
}

async fn subscription(
    schema: web::Data<AppSchema>,
    http_req: HttpRequest,
    session: Session,
    payload: web::Payload,
) -> Result<HttpResponse> {
    let mut data = async_graphql::Data::default();
    if let Ok(identity) = session.get::<Identity>(AUTHENTICATED_USER_KEY) {
        data.insert(identity);
    }

    GraphQLSubscription::new(Schema::clone(&*schema))
        .with_data(data)
        .start(&http_req, payload)
}

async fn playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(
            GraphQLPlaygroundConfig::new("/").subscription_endpoint("/"),
        ))
}
