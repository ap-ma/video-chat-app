use super::entity::*;
use super::schema::{
    calls, contacts, email_verification_tokens, messages, password_reset_tokens, users,
};
use crate::constant::{contact as contact_const, message as message_const, user as user_const};
use chrono::Local;
use diesel::prelude::*;
use diesel::sql_types::{Bigint, Bool, Integer, Unsigned};

diesel::no_arg_sql_function!(last_insert_id, Unsigned<Bigint>);

pub fn create_user(new_user: NewUserEntity, conn: &MysqlConnection) -> QueryResult<UserEntity> {
    use super::schema::users::dsl::*;
    diesel::insert_into(users).values(new_user).execute(conn)?;
    let user_id: u64 = diesel::select(last_insert_id).first(conn)?;
    users.find(user_id).first(conn)
}

pub fn update_user(change_user: ChangeUserEntity, conn: &MysqlConnection) -> QueryResult<usize> {
    diesel::update(&change_user).set(&change_user).execute(conn)
}

pub fn find_user_by_id(user_id: u64, conn: &MysqlConnection) -> QueryResult<UserEntity> {
    users::table
        .find(user_id)
        .filter(users::status.eq(user_const::status::ACTIVE))
        .first(conn)
}

pub fn find_user_including_unverified(
    user_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<UserEntity> {
    users::table
        .find(user_id)
        .filter(users::status.ne(user_const::status::DELETED))
        .first(conn)
}

pub fn find_user_by_code(
    code: &str,
    excluded_user_id: Option<u64>,
    conn: &MysqlConnection,
) -> QueryResult<UserEntity> {
    let mut query = users::table
        .filter(users::code.eq(code))
        .filter(users::status.eq(user_const::status::ACTIVE))
        .into_boxed();

    if let Some(excluded_user_id) = excluded_user_id {
        query = query.filter(users::id.ne(excluded_user_id));
    }

    query.first(conn)
}

pub fn find_user_by_email(email: &str, conn: &MysqlConnection) -> QueryResult<UserEntity> {
    users::table
        .filter(users::email.eq(email))
        .filter(users::status.eq(user_const::status::ACTIVE))
        .first(conn)
}

pub fn find_users_by_code(
    user_code: &str,
    conn: &MysqlConnection,
) -> QueryResult<Option<UserEntity>> {
    users::table
        .filter(users::code.eq(user_code))
        .filter(users::status.eq(user_const::status::ACTIVE))
        .first(conn)
        .optional()
}

pub fn create_contact(
    new_contact: NewContactEntity,
    conn: &MysqlConnection,
) -> QueryResult<ContactEntity> {
    use super::schema::contacts::dsl::*;
    diesel::insert_into(contacts)
        .values(new_contact)
        .execute(conn)?;
    let contact_id: u64 = diesel::select(last_insert_id).first(conn)?;
    contacts.find(contact_id).first(conn)
}

pub fn update_contact(
    change_contact: ChangeContactEntity,
    conn: &MysqlConnection,
) -> QueryResult<usize> {
    diesel::update(&change_contact)
        .set(&change_contact)
        .execute(conn)
}

pub fn find_contact_by_id(contact_id: u64, conn: &MysqlConnection) -> QueryResult<ContactEntity> {
    contacts::table.find(contact_id).first(conn)
}

pub fn find_contact_with_user(
    user_id: u64,
    contact_user_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<(ContactEntity, UserEntity)> {
    contacts::table
        .inner_join(users::table.on(users::id.eq(contacts::contact_user_id)))
        .filter(contacts::user_id.eq(user_id))
        .filter(contacts::contact_user_id.eq(contact_user_id))
        .filter(users::status.eq(user_const::status::ACTIVE))
        .first(conn)
}

pub fn get_contacts(
    user_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<Vec<(ContactEntity, UserEntity)>> {
    contacts::table
        .inner_join(users::table.on(users::id.eq(contacts::contact_user_id)))
        .filter(contacts::user_id.eq(user_id))
        .filter(contacts::status.eq(contact_const::status::APPROVED))
        .filter(contacts::blocked.eq(false))
        .filter(users::status.eq(user_const::status::ACTIVE))
        .order(users::name.asc())
        .load(conn)
}

pub fn create_message(
    new_message: NewMessageEntity,
    conn: &MysqlConnection,
) -> QueryResult<MessageEntity> {
    use super::schema::messages::dsl::*;
    diesel::insert_into(messages)
        .values(new_message)
        .execute(conn)?;
    let message_id: u64 = diesel::select(last_insert_id).first(conn)?;
    messages.find(message_id).first(conn)
}

pub fn update_message(
    change_message: ChangeMessageEntity,
    conn: &MysqlConnection,
) -> QueryResult<usize> {
    diesel::update(&change_message)
        .set(&change_message)
        .execute(conn)
}

pub fn update_message_to_read(
    user_id: u64,
    other_user_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<usize> {
    use super::schema::messages::dsl::*;
    let target = messages
        .filter(tx_user_id.eq(other_user_id))
        .filter(rx_user_id.eq(user_id))
        .filter(status.eq(message_const::status::UNREAD));
    diesel::update(target)
        .set((
            status.eq(message_const::status::READ),
            updated_at.eq(Local::now().naive_local()),
        ))
        .execute(conn)
}

pub fn find_message_by_id(
    message_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<(MessageEntity, Option<CallEntity>)> {
    messages::table
        .find(message_id)
        .left_join(calls::table.on(calls::message_id.eq(messages::id)))
        .first(conn)
}

pub fn get_messages(
    user_id: u64,
    other_user_id: u64,
    cursor: Option<u64>,
    limit: Option<i64>,
    conn: &MysqlConnection,
) -> QueryResult<Vec<(MessageEntity, Option<CallEntity>)>> {
    let mut query = messages::table
        .left_join(calls::table.on(calls::message_id.eq(messages::id)))
        .into_boxed();

    if let Some(value) = cursor {
        query = query.filter(messages::id.lt(value));
    }

    query = query
        .filter(
            (messages::tx_user_id
                .eq(user_id)
                .and(messages::rx_user_id.eq(other_user_id)))
            .or(messages::tx_user_id
                .eq(other_user_id)
                .and(messages::rx_user_id.eq(user_id))),
        )
        .filter(messages::status.ne(message_const::status::DELETED))
        .order(messages::id.desc());

    if let Some(value) = limit {
        query = query.limit(value);
    }

    query.load(conn)
}

pub fn get_unread_message_count(
    user_id: u64,
    other_user_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<i64> {
    messages::table
        .filter(messages::tx_user_id.eq(other_user_id))
        .filter(messages::rx_user_id.eq(user_id))
        .filter(messages::status.eq(message_const::status::UNREAD))
        .count()
        .first(conn)
}

pub fn get_unread_messages(
    user_id: u64,
    other_user_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<Vec<(MessageEntity, Option<CallEntity>)>> {
    messages::table
        .left_join(calls::table.on(calls::message_id.eq(messages::id)))
        .filter(messages::tx_user_id.eq(other_user_id))
        .filter(messages::rx_user_id.eq(user_id))
        .filter(messages::status.eq(message_const::status::UNREAD))
        .load(conn)
}

pub fn get_latest_message(
    user_id: u64,
    other_user_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<(MessageEntity, Option<CallEntity>)> {
    messages::table
        .left_join(calls::table.on(calls::message_id.eq(messages::id)))
        .filter(
            (messages::tx_user_id
                .eq(user_id)
                .and(messages::rx_user_id.eq(other_user_id)))
            .or(messages::tx_user_id
                .eq(other_user_id)
                .and(messages::rx_user_id.eq(user_id))),
        )
        .filter(messages::status.ne(message_const::status::DELETED))
        .order(messages::id.desc())
        .first(conn)
}

pub fn get_latest_messages_for_each_user(
    user_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<Vec<LatestMessageEntity>> {
    diesel::sql_query(include_str!("./sql/get_latest_messages_for_each_user.sql"))
        .bind::<Unsigned<Bigint>, _>(user_id)
        .bind::<Unsigned<Bigint>, _>(user_id)
        .bind::<Integer, _>(message_const::status::DELETED)
        .bind::<Unsigned<Bigint>, _>(user_id)
        .bind::<Unsigned<Bigint>, _>(user_id)
        .bind::<Integer, _>(user_const::status::ACTIVE)
        .bind::<Bool, _>(false)
        .load(conn)
}

pub fn create_call(new_call: NewCallEntity, conn: &MysqlConnection) -> QueryResult<CallEntity> {
    use super::schema::calls::dsl::*;
    diesel::insert_into(calls).values(new_call).execute(conn)?;
    let call_id: u64 = diesel::select(last_insert_id).first(conn)?;
    calls.find(call_id).first(conn)
}

pub fn _update_call(change_call: ChangeCallEntity, conn: &MysqlConnection) -> QueryResult<usize> {
    diesel::update(&change_call).set(&change_call).execute(conn)
}

pub fn _find_call_by_id(call_id: u64, conn: &MysqlConnection) -> QueryResult<CallEntity> {
    calls::table.find(call_id).first(conn)
}

pub fn create_email_verification_token(
    email_verification_token: NewEmailVerificationTokenEntity,
    conn: &MysqlConnection,
) -> QueryResult<EmailVerificationTokenEntity> {
    use super::schema::email_verification_tokens::dsl::*;
    let id = email_verification_token.user_id;
    diesel::insert_into(email_verification_tokens)
        .values(email_verification_token)
        .execute(conn)?;
    email_verification_tokens.find(id).first(conn)
}

pub fn delete_email_verification_token(user_id: u64, conn: &MysqlConnection) -> QueryResult<usize> {
    diesel::delete(email_verification_tokens::table.find(user_id)).execute(conn)
}

pub fn upsert_email_verification_token(
    email_verification_token: NewEmailVerificationTokenEntity,
    conn: &MysqlConnection,
) -> QueryResult<EmailVerificationTokenEntity> {
    delete_email_verification_token(email_verification_token.user_id, conn)?;
    create_email_verification_token(email_verification_token, conn)
}

pub fn find_email_verification_token_by_user_id(
    user_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<EmailVerificationTokenEntity> {
    email_verification_tokens::table.find(user_id).first(conn)
}

pub fn create_password_reset_token(
    password_reset_token: NewPasswordResetTokenEntity,
    conn: &MysqlConnection,
) -> QueryResult<PasswordResetTokenEntity> {
    use super::schema::password_reset_tokens::dsl::*;
    let id = password_reset_token.user_id;
    diesel::insert_into(password_reset_tokens)
        .values(password_reset_token)
        .execute(conn)?;
    password_reset_tokens.find(id).first(conn)
}

pub fn delete_password_reset_token(user_id: u64, conn: &MysqlConnection) -> QueryResult<usize> {
    diesel::delete(password_reset_tokens::table.find(user_id)).execute(conn)
}

pub fn upsert_password_reset_token(
    password_reset_token: NewPasswordResetTokenEntity,
    conn: &MysqlConnection,
) -> QueryResult<PasswordResetTokenEntity> {
    delete_password_reset_token(password_reset_token.user_id, conn)?;
    create_password_reset_token(password_reset_token, conn)
}

pub fn find_password_reset_token_by_user_id(
    user_id: u64,
    conn: &MysqlConnection,
) -> QueryResult<PasswordResetTokenEntity> {
    password_reset_tokens::table.find(user_id).first(conn)
}
