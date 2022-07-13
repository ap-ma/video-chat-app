use async_graphql::*;

#[derive(InputObject)]
pub struct SendIceCandidateInput {
    pub call_id: ID,
    pub other_user_id: ID,
    pub candidate: String,
}
