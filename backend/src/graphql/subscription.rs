use super::common::SimpleBroker;
use super::model::{IceCandidate, MessageChanged, Signal};
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
        let identity = auth::get_identity(ctx)?;
        let stream = SimpleBroker::<MessageChanged>::subscribe().filter(move |event| {
            let res = event.tx_user_id != identity.id && event.rx_user_id == identity.id;
            async move { res }
        });
        Ok(stream)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn signaling_subscription(
        &self,
        ctx: &Context<'_>,
    ) -> Result<impl Stream<Item = Signal>> {
        let identity = auth::get_identity(ctx)?;
        let stream = SimpleBroker::<Signal>::subscribe().filter(move |event| {
            let res = event.tx_user_id != identity.id && event.rx_user_id == identity.id;
            async move { res }
        });

        Ok(stream)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn ice_candidate_subscription(
        &self,
        ctx: &Context<'_>,
    ) -> Result<impl Stream<Item = IceCandidate>> {
        let identity = auth::get_identity(ctx)?;
        let stream = SimpleBroker::<IceCandidate>::subscribe().filter(move |event| {
            let res = event.tx_user_id != identity.id && event.rx_user_id == identity.id;
            async move { res }
        });

        Ok(stream)
    }
}
