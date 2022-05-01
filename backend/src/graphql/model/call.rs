use crate::constant::system::DEFAULT_DATETIME_FORMAT;
use crate::database::entity::CallEntity;
use async_graphql::*;
use chrono::NaiveDateTime;

#[derive(Clone, Debug)]
pub struct Call {
    pub id: u64,
    pub message_id: u64,
    pub status: i32,
    pub started_at: Option<NaiveDateTime>,
    pub ended_at: Option<NaiveDateTime>,
}

impl From<&CallEntity> for Call {
    fn from(entity: &CallEntity) -> Self {
        Self {
            id: entity.id,
            message_id: entity.message_id,
            status: entity.status,
            started_at: entity.started_at.clone(),
            ended_at: entity.ended_at.clone(),
        }
    }
}

#[Object]
impl Call {
    async fn id(&self) -> ID {
        self.id.into()
    }

    async fn message_id(&self) -> ID {
        self.message_id.into()
    }

    async fn status(&self) -> i32 {
        self.status
    }

    async fn started_at(&self, format: Option<String>) -> Option<String> {
        let f = format.unwrap_or(DEFAULT_DATETIME_FORMAT.to_owned());
        self.started_at.map(|d| d.format(f.as_str()).to_string())
    }

    async fn ended_at(&self, format: Option<String>) -> Option<String> {
        let f = format.unwrap_or(DEFAULT_DATETIME_FORMAT.to_owned());
        self.ended_at.map(|d| d.format(f.as_str()).to_string())
    }

    async fn call_time(&self) -> Option<i64> {
        if self.started_at.is_some() && self.ended_at.is_some() {
            let started_at = self.started_at.unwrap();
            let ended_at = self.ended_at.unwrap();
            let call_time = ended_at - started_at;
            return Some(call_time.num_minutes());
        }

        None
    }
}
