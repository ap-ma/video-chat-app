use super::entity::*;
use super::schema::users;
use crate::constants::user as user_const;
use diesel::prelude::*;
use diesel::sql_types::{Bigint, Unsigned};

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
