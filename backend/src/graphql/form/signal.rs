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
