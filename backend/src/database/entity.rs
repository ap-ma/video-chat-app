use super::schema::{
    calls, contacts, email_verification_tokens, messages, password_reset_tokens, users,
};
use chrono::NaiveDateTime;
use diesel::dsl::SqlTypeOf;
use diesel::sql_types::{BigInt, Nullable};

#[derive(Identifiable, Queryable)]
#[table_name = "users"]
pub struct UserEntity {
    pub id: u64,
    pub code: String,
    pub name: Option<String>,
    pub email: String,
    pub password: String,
    pub remember_token: Option<String>,
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
    pub comment: Option<String>,
    pub avatar: Option<String>,
    pub role: i32,
    pub status: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Identifiable, AsChangeset, Default)]
#[table_name = "users"]
pub struct ChangeUserEntity {
    pub id: u64,
    pub code: Option<String>,
    pub name: Option<Option<String>>,
    pub email: Option<String>,
    pub password: Option<String>,
    pub remember_token: Option<Option<String>>,
    pub comment: Option<Option<String>>,
    pub avatar: Option<Option<String>>,
    pub role: Option<i32>,
    pub status: Option<i32>,
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Identifiable, Queryable, Associations)]
#[table_name = "contacts"]
#[belongs_to(UserEntity, foreign_key = "user_id")]
pub struct ContactEntity {
    pub id: u64,
    pub user_id: u64,
    pub contact_user_id: u64,
    pub status: i32,
    pub blocked: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable)]
#[table_name = "contacts"]
pub struct NewContactEntity {
    pub user_id: u64,
    pub contact_user_id: u64,
    pub status: i32,
    pub blocked: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Identifiable, AsChangeset, Default)]
#[table_name = "contacts"]
pub struct ChangeContactEntity {
    pub id: u64,
    pub user_id: Option<u64>,
    pub contact_user_id: Option<u64>,
    pub status: Option<i32>,
    pub blocked: Option<bool>,
    pub updated_at: Option<NaiveDateTime>,
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

#[derive(Insertable)]
#[table_name = "messages"]
pub struct NewMessageEntity {
    pub tx_user_id: u64,
    pub rx_user_id: u64,
    pub category: i32,
    pub message: Option<String>,
    pub status: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Identifiable, AsChangeset, Default)]
#[table_name = "messages"]
pub struct ChangeMessageEntity {
    pub id: u64,
    pub tx_user_id: Option<u64>,
    pub rx_user_id: Option<u64>,
    pub category: Option<i32>,
    pub message: Option<Option<String>>,
    pub status: Option<i32>,
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(QueryableByName)]
pub struct MessageDateCount {
    #[sql_type = "BigInt"]
    pub date_count: i64,
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
    #[sql_type = "SqlTypeOf<messages::tx_user_id>"]
    pub tx_user_id: u64,
    #[sql_type = "SqlTypeOf<messages::category>"]
    pub message_category: i32,
    #[sql_type = "SqlTypeOf<messages::message>"]
    pub message: Option<String>,
    #[sql_type = "SqlTypeOf<messages::status>"]
    pub message_status: i32,
    #[sql_type = "SqlTypeOf<messages::created_at>"]
    pub created_at: NaiveDateTime,
    #[sql_type = "Nullable<SqlTypeOf<calls::id>>"]
    pub call_id: Option<u64>,
    #[sql_type = "Nullable<SqlTypeOf<calls::status>>"]
    pub call_status: Option<i32>,
    #[sql_type = "SqlTypeOf<calls::started_at>"]
    pub call_started_at: Option<NaiveDateTime>,
    #[sql_type = "SqlTypeOf<calls::ended_at>"]
    pub call_ended_at: Option<NaiveDateTime>,
}

#[derive(Identifiable, Queryable)]
#[table_name = "calls"]
pub struct CallEntity {
    pub id: u64,
    pub message_id: u64,
    pub status: i32,
    pub started_at: Option<NaiveDateTime>,
    pub ended_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable)]
#[table_name = "calls"]
pub struct NewCallEntity {
    pub message_id: u64,
    pub status: i32,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Identifiable, AsChangeset, Default)]
#[table_name = "calls"]
pub struct ChangeCallEntity {
    pub id: u64,
    pub message_id: Option<u64>,
    pub status: Option<i32>,
    pub started_at: Option<Option<NaiveDateTime>>,
    pub ended_at: Option<Option<NaiveDateTime>>,
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Identifiable, Queryable)]
#[table_name = "email_verification_tokens"]
#[primary_key(user_id)]
pub struct EmailVerificationTokenEntity {
    pub user_id: u64,
    pub category: i32,
    pub email: String,
    pub token: String,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable)]
#[table_name = "email_verification_tokens"]
pub struct NewEmailVerificationTokenEntity {
    pub user_id: u64,
    pub category: i32,
    pub email: String,
    pub token: String,
    pub created_at: NaiveDateTime,
}

#[derive(Identifiable, Queryable)]
#[table_name = "password_reset_tokens"]
#[primary_key(user_id)]
pub struct PasswordResetTokenEntity {
    pub user_id: u64,
    pub token: String,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable)]
#[table_name = "password_reset_tokens"]
pub struct NewPasswordResetTokenEntity {
    pub user_id: u64,
    pub token: String,
    pub created_at: NaiveDateTime,
}
