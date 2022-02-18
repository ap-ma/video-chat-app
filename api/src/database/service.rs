use super::entity::*;
use diesel::prelude::*;
use diesel::sql_types::{Bigint, Unsigned};

diesel::no_arg_sql_function!(last_insert_id, Unsigned<Bigint>);

pub fn create_user(user: NewUserEntity, conn: &MysqlConnection) -> QueryResult<UserEntity> {
  use super::schema::users::dsl::*;
  diesel::insert_into(users).values(user).execute(conn)?;
  let user_id: u64 = diesel::select(last_insert_id).first(conn)?;
  users.filter(id.eq(user_id)).first(conn)
}
