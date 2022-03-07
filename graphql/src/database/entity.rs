use super::schema::{contacts, messages, users};
use chrono::NaiveDateTime;
use diesel::dsl::SqlTypeOf;

#[derive(Identifiable, Queryable)]
#[table_name = "users"]
pub struct UserEntity {
    pub id: u64,
    pub code: String,
    pub name: Option<String>,
    pub email: String,
    pub password: String,
    pub secret: String,
    pub comment: Option<String>,
    pub avatar: Option<String>,
    pub role: i32,
    pub status: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUserEntity {
    pub code: String,
    pub name: Option<String>,
    pub email: String,
    pub password: String,
    pub secret: String,
    pub comment: Option<String>,
    pub avatar: Option<String>,
    pub role: i32,
    pub status: i32,
}

#[derive(AsChangeset)]
#[table_name = "users"]
pub struct ChangeUserEntity {
    pub code: Option<String>,
    pub name: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
    pub secret: Option<String>,
    pub comment: Option<String>,
    pub avatar: Option<String>,
    pub role: Option<i32>,
    pub status: Option<i32>,
}

#[derive(Identifiable, Queryable, Associations)]
#[table_name = "contacts"]
#[belongs_to(UserEntity, foreign_key = "user_id")]
pub struct ContactEntity {
    pub id: u64,
    pub user_id: u64,
    pub contact_user_id: u64,
    pub status: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Identifiable, Queryable, QueryableByName)]
#[table_name = "messages"]
pub struct MessageEntity {
    pub id: u64,
    pub tx_user_id: u64,
    pub rx_user_id: u64,
    pub category: i32,
    pub message: Option<String>,
    pub status: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(QueryableByName)]
pub struct LatestMessageEntity {
    #[sql_type = "SqlTypeOf<users::id>"]
    pub user_id: u64,
    #[sql_type = "SqlTypeOf<users::code>"]
    pub user_code: String,
    #[sql_type = "SqlTypeOf<users::name>"]
    pub user_name: Option<String>,
    #[sql_type = "SqlTypeOf<users::avatar>"]
    pub user_avatar: Option<String>,
    #[sql_type = "SqlTypeOf<messages::id>"]
    pub message_id: u64,
    #[sql_type = "SqlTypeOf<messages::category>"]
    pub message_category: i32,
    #[sql_type = "SqlTypeOf<messages::message>"]
    pub message: Option<String>,
}
