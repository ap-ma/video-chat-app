use async_graphql::*;

#[derive(InputObject)]
pub struct SendIceCandidatesInput {
    pub call_id: ID,
    pub other_user_id: ID,
    pub candidates: Vec<String>,
}
