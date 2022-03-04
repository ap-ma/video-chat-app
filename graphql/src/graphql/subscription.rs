use super::common::SimpleBroker;
use super::model::MessageChanged;
use super::security::guard::RoleGuard;
use super::{convert_id, get_identity_from_ctx};
use crate::auth::Role;
use async_graphql::*;
use futures::Stream;
use futures_util::StreamExt;

pub struct Subscription;

#[Subscription]
impl Subscription {
    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn message(&self, ctx: &Context<'_>) -> impl Stream<Item = MessageChanged> {
        let identity = get_identity_from_ctx(ctx).expect("Unable to get signed-in user");
        SimpleBroker::<MessageChanged>::subscribe().filter(move |event| {
            let res = identity.id == convert_id(&event.rx_user_id);
            async move { res }
        })
    }
}
