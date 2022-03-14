use super::common::{self, SimpleBroker};
use super::model::MessageChanged;
use super::security::guard::RoleGuard;
use crate::auth::Role;
use async_graphql::*;
use futures::Stream;
use futures_util::StreamExt;

pub struct Subscription;

#[Subscription]
impl Subscription {
    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn message(&self, ctx: &Context<'_>) -> impl Stream<Item = MessageChanged> {
        let identity = common::get_identity_from_ctx(ctx).unwrap();
        SimpleBroker::<MessageChanged>::subscribe().filter(move |event| {
            let res = event.tx_user_id != identity.id && event.rx_user_id == identity.id;
            async move { res }
        })
    }
}
