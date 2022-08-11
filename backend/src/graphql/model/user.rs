use crate::database::entity::UserEntity;
use crate::graphql::common;
use crate::graphql::security::guard::ResourceGuard;
use crate::graphql::GraphqlError;
use async_graphql::*;

#[derive(Clone, Debug)]
pub struct User {
    pub id: u64,
    pub code: String,
    pub name: Option<String>,
    pub email: String,
    pub comment: Option<String>,
    pub avatar: Option<String>,
}

impl From<&UserEntity> for User {
    fn from(entity: &UserEntity) -> Self {
        Self {
            id: entity.id,
            code: entity.code.clone(),
            name: entity.name.clone(),
            email: entity.email.clone(),
            comment: entity.comment.clone(),
            avatar: entity.avatar.clone(),
        }
    }
}

#[Object]
impl User {
    async fn id(&self) -> ID {
        self.id.into()
    }

    async fn code(&self) -> &str {
        self.code.as_str()
    }

    async fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }

    #[graphql(guard = "ResourceGuard::new(self.id)")]
    async fn email(&self) -> &str {
        self.email.as_str()
    }

    async fn comment(&self) -> Option<&str> {
        self.comment.as_deref()
    }

    async fn avatar(&self) -> Result<Option<String>> {
        if let Some(filename) = self.avatar.clone() {
            let filename = common::get_avatar_file_path(&filename, self.id);
            let signed_url = common::file_download_url(&filename).await.map_err(|e| {
                let m = "Failed to generate signed URL.";
                GraphqlError::ServerError(m.into(), e.message).extend()
            })?;
            return Ok(Some(signed_url));
        };

        Ok(None)
    }
}
