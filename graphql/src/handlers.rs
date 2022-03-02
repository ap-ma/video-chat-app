use crate::graphql::AppSchema;
use crate::{auth, auth::Sign};
use actix_session::Session;
use actix_web::{guard, web, HttpRequest, HttpResponse, Result};
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::Schema;
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse, GraphQLSubscription};
use std::sync::{Arc, Mutex};

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
    request: GraphQLRequest,
    session: Session,
) -> GraphQLResponse {
    let mut query = request.into_inner();

    // 認証済ユーザー 取得
    if let Some(identity) = auth::get_identity(&session) {
        query = query.data(identity);
    }

    // ユーザー認証によるセッションの追加/削除処理をactix web側のハンドラーに委譲するため、
    // 処理種別を表現するenumのoptionをasync graphqlと共有する
    let auth_proc: Arc<Mutex<Option<Sign>>> = Default::default();
    query = query.data(Arc::clone(&auth_proc));

    let response = schema.execute(query).await.into();

    // ユーザー認証によるセッションへの追加/削除が発生した場合
    if let Some(ref mode) = *auth_proc.lock().unwrap() {
        auth::handle(mode, &session);
    }

    response
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
