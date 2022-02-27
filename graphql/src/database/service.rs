use super::entity::*;
use super::schema::{contacts, messages, users};
use crate::constants::contact as contact_const;
use crate::constants::message as message_const;
use crate::constants::user as user_const;
use diesel::prelude::*;
use diesel::sql_types::{Bigint, Integer, Unsigned};

diesel::no_arg_sql_function!(last_insert_id, Unsigned<Bigint>);

pub fn create_user(user: NewUserEntity, conn: &MysqlConnection) -> QueryResult<UserEntity> {
  use super::schema::users::dsl::*;
  diesel::insert_into(users).values(user).execute(conn)?;
  let user_id: u64 = diesel::select(last_insert_id).first(conn)?;
  users.find(user_id).first(conn)
}

pub fn find_user_by_email(email: &str, conn: &MysqlConnection) -> QueryResult<UserEntity> {
  users::table
    .filter(users::email.eq(email))
    .filter(users::status.eq(user_const::status::ACTIVE))
    .first(conn)
}

pub fn get_contacts_by_user_id(user_id: u64, conn: &MysqlConnection) -> QueryResult<Vec<ContactEntity>> {
  contacts::table
    .filter(contacts::user_id.eq(user_id))
    .filter(contacts::status.eq(contact_const::status::APPROVED))
    .load(conn)
}

pub fn get_latest_messages_for_each_contact(
  user_id: u64,
  conn: &MysqlConnection,
) -> QueryResult<Vec<MessageEntity>> {
  diesel::sql_query(include_str!("./sql/get_latest_messages_for_each_contact.sql"))
    .bind::<Unsigned<Bigint>, _>(user_id)
    .bind::<Unsigned<Bigint>, _>(user_id)
    .bind::<Integer, _>(message_const::status::DELETED)
    .bind::<Unsigned<Bigint>, _>(user_id)
    .bind::<Integer, _>(user_const::status::ACTIVE)
    .load::<MessageEntity>(conn)
}
