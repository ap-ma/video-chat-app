table! {
    contacts (id) {
        id -> Unsigned<Bigint>,
        user_id -> Unsigned<Bigint>,
        contact_user_id -> Unsigned<Bigint>,
        status -> Integer,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        version -> Integer,
    }
}

table! {
    messages (id) {
        id -> Unsigned<Bigint>,
        tx_user_id -> Unsigned<Bigint>,
        rx_user_id -> Unsigned<Bigint>,
        #[sql_name = "type"]
        type_ -> Integer,
        message -> Nullable<Text>,
        status -> Integer,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        version -> Integer,
    }
}

table! {
    users (id) {
        id -> Unsigned<Bigint>,
        code -> Varchar,
        name -> Nullable<Varchar>,
        name_alphabet -> Nullable<Varchar>,
        email -> Varchar,
        password -> Varchar,
        avatar -> Nullable<Mediumtext>,
        status -> Integer,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        version -> Integer,
    }
}

allow_tables_to_appear_in_same_query!(
    contacts,
    messages,
    users,
);
