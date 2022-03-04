mod simple_broker;

use async_graphql::Enum;
pub use simple_broker::SimpleBroker;

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum MutationType {
    Created,
    Updated,
    Deleted,
}
