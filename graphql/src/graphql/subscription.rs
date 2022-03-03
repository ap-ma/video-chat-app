use async_graphql::*;
use futures::Stream;
use std::{thread, time::Duration};

pub struct Subscription;

#[Subscription]
impl Subscription {
    async fn interval(&self, #[graphql(default = 1)] n: i32) -> impl Stream<Item = i32> {
        let mut value = 0;
        async_stream::stream! {
            loop {
                thread::sleep(Duration::from_secs(10));
                value += n;
                yield value;
            }
        }
    }
}
