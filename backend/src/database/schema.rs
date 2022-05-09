table! {
    calls (id) {
        id -> Unsigned<Bigint>,
        message_id -> Unsigned<Bigint>,
        status -> Integer,
        started_at -> Nullable<Datetime>,
        ended_at -> Nullable<Datetime>,
        created_at -> Datetime,
        updated_at -> Datetime,
    }
}

table! {
    contacts (id) {
        id -> Unsigned<Bigint>,
        user_id -> Unsigned<Bigint>,
        contact_user_id -> Unsigned<Bigint>,
        status -> Integer,
        blocked -> Bool,
        created_at -> Datetime,
        updated_at -> Datetime,
    }
}

table! {
    email_verification_tokens (user_id) {
        user_id -> Unsigned<Bigint>,
        category -> Integer,
        email -> Varchar,
        token -> Varchar,
        created_at -> Datetime,
    }
}

table! {
    messages (id) {
        id -> Unsigned<Bigint>,
        tx_user_id -> Unsigned<Bigint>,
        rx_user_id -> Unsigned<Bigint>,
        category -> Integer,
        message -> Nullable<Text>,
        status -> Integer,
        created_at -> Datetime,
        updated_at -> Datetime,
    }
}

table! {
    password_reset_tokens (user_id) {
        user_id -> Unsigned<Bigint>,
        token -> Varchar,
        created_at -> Datetime,
    }
}

table! {
    users (id) {
        id -> Unsigned<Bigint>,
        code -> Varchar,
        name -> Nullable<Varchar>,
        email -> Varchar,
        password -> Varchar,
        remember_token -> Nullable<Varchar>,
        comment -> Nullable<Text>,
        avatar -> Nullable<Varchar>,
        role -> Integer,
        status -> Integer,
        created_at -> Datetime,
        updated_at -> Datetime,
    }
}

allow_tables_to_appear_in_same_query!(
    calls,
    contacts,
    email_verification_tokens,
    messages,
    password_reset_tokens,
    users,
);
