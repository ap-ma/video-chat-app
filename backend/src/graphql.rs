mod common;
mod form;
mod model;
mod mutation;
mod query;
mod security;
mod subscription;

use crate::database::MySqlPool;
use async_graphql::{extensions::Logger, Error, ErrorExtensions, Schema};
use mutation::Mutation;
use query::Query;
use subscription::Subscription;

pub type AppSchema = Schema<Query, Mutation, Subscription>;

#[derive(Debug, Error)]
pub enum GraphqlError {
    // バリデーション (error_code, field_name)
    #[error("ValidationError")]
    ValidationError(String, &'static str),

    // 認証
    #[error("AuthenticationError")]
    AuthenticationError,

    // 認可 (message)
    #[error("AuthorizationError")]
    AuthorizationError(String),

    // サーバーエラー (message, description)
    #[error("InternalServerError")]
    ServerError(String, String),
}

impl ErrorExtensions for GraphqlError {
    fn extend(&self) -> Error {
        let message = match self {
            GraphqlError::ValidationError(error_code, _) => error_code,
            GraphqlError::AuthenticationError => "Not authenticated.",
            GraphqlError::AuthorizationError(message) => message,
            GraphqlError::ServerError(message, _) => message,
        };
        Error::new(message)
            .extend_with(|_, e| e.set("type", self.to_string()))
            .extend_with(|_, e| match self {
                GraphqlError::ValidationError(_, field) => e.set("field", field.to_owned()),
                GraphqlError::ServerError(_, description) => {
                    e.set("description", description.to_owned())
                }
                _ => (),
            })
    }
}

pub fn create_schema(pool: MySqlPool) -> AppSchema {
    Schema::build(Query, Mutation, Subscription)
        .data(pool)
        // enable logger
        .extension(Logger)
        .finish()
}
