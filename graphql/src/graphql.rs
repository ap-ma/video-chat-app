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
    #[error("Validation Error")]
    ValidationError(String, String),

    #[error("Internal Server Error")]
    ServerError(String),
}

impl ErrorExtensions for GraphqlError {
    fn extend(&self) -> Error {
        let message = match self {
            GraphqlError::ValidationError(_, message) => message,
            GraphqlError::ServerError(message) => message,
        };
        Error::new(message)
            .extend_with(|_, e| e.set("type", format!("{}", self)))
            .extend_with(|_, e| match self {
                GraphqlError::ValidationError(field, _) => e.set("field", field.to_owned()),
                GraphqlError::ServerError(detail) => e.set("detail", detail.to_owned()),
            })
    }
}

pub fn create_schema(pool: MySqlPool) -> AppSchema {
    Schema::build(Query, Mutation, Subscription)
        .data(pool)
        .extension(Logger)
        .finish()
}
