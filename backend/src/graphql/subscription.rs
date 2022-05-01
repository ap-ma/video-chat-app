use super::common::SimpleBroker;
use super::model::{CallEvent, MessageChanged};
use super::security::auth::{self, Role};
use super::security::guard::RoleGuard;
use async_graphql::*;
use futures::Stream;
use futures_util::StreamExt;

pub struct Subscription;

#[Subscription]
impl Subscription {
    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn message_subscription(
        &self,
        ctx: &Context<'_>,
    ) -> Result<impl Stream<Item = MessageChanged>> {
        let identity = auth::get_identity(ctx)?.unwrap();
        let stream = SimpleBroker::<MessageChanged>::subscribe().filter(move |event| {
            let res = event.tx_user_id != identity.id && event.rx_user_id == identity.id;
            async move { res }
        });

        Ok(stream)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn call_event_subscription(
        &self,
        ctx: &Context<'_>,
    ) -> Result<impl Stream<Item = CallEvent>> {
        let identity = auth::get_identity(ctx)?.unwrap();
        let stream = SimpleBroker::<CallEvent>::subscribe().filter(move |event| {
            let res = event.tx_user_id != identity.id && event.rx_user_id == identity.id;
            async move { res }
        });

        Ok(stream)
    }
}
