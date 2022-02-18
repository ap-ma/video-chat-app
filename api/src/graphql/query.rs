use async_graphql::*;

pub struct Query;

#[Object]
impl Query {
  async fn a(&self) -> String {
    String::from("a")
  }
}
