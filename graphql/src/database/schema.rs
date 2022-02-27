table! {
    contacts (id) {
        id -> Unsigned<Bigint>,
        user_id -> Unsigned<Bigint>,
        contact_user_id -> Unsigned<Bigint>,
        status -> Integer,
        created_at -> Datetime,
        updated_at -> Datetime,
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
    users (id) {
        id -> Unsigned<Bigint>,
        code -> Varchar,
        name -> Nullable<Varchar>,
        email -> Varchar,
        password -> Varchar,
        secret -> Varchar,
        avatar -> Nullable<Varchar>,
        role -> Integer,
        status -> Integer,
        created_at -> Datetime,
        updated_at -> Datetime,
    }
}

allow_tables_to_appear_in_same_query!(
    contacts,
    messages,
    users,
);
