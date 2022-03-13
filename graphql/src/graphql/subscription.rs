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
            // idのパースに失敗する場合はfalseとして扱う
            let res = common::convert_id(&event.tx_user_id).unwrap_or(0) != identity.id
                && common::convert_id(&event.rx_user_id).unwrap_or(0) == identity.id;
            async move { res }
        })
    }
}
