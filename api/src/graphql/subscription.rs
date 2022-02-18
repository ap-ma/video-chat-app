use async_graphql::*;
use futures::{Stream, StreamExt};
use async_graphql::{EmptySubscription, Schema};

pub struct Subscription;

// #[Subscription]
// impl Subscription {
//     async fn integers(&self, #[graphql(default = 1)] step: i32) -> impl Stream<Item = i32> {
//         let mut value = 0;
//         tokio_stream::wrappers::IntervalStream::new(tokio::time::interval(Duration::from_secs(1)))
//             .map(move |_| {
//                 value += step;
//                 value
//             })
//     }
// }