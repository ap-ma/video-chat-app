use async_graphql::*;

#[derive(InputObject)]
pub struct RingUpInput {
    pub contact_id: ID,
    pub sdp: String,
}

#[derive(InputObject)]
pub struct PickUpInput {
    pub call_id: ID,
    pub sdp: String,
}

#[derive(InputObject)]
pub struct CandidateInput {
    pub call_id: ID,
    pub other_user_id: ID,
    pub candidate: String,
}
