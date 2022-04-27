pub mod system {
    use once_cell::sync::Lazy;

    pub static APP_ADDR: Lazy<String> =
        Lazy::new(|| std::env::var("APP_ADDR").expect("Unable to get APP_ADDR"));

    pub static APP_DOMAIN: Lazy<String> =
        Lazy::new(|| std::env::var("APP_DOMAIN").expect("Unable to get APP_DOMAIN"));

    pub static API_URL: Lazy<String> =
        Lazy::new(|| std::env::var("API_URL").expect("Unable to get API_URL"));

    pub static FRONT_URL: Lazy<String> =
        Lazy::new(|| std::env::var("FRONT_URL").expect("Unable to get FRONT_URL"));

    pub static REDIS_URL: Lazy<String> =
        Lazy::new(|| std::env::var("REDIS_URL").expect("Unable to get REDIS_URL"));

    pub static DATABASE_URL: Lazy<String> =
        Lazy::new(|| std::env::var("DATABASE_URL").expect("Unable to get DATABASE_URL"));

    pub static CORS_MAX_AGE: Lazy<usize> = Lazy::new(|| {
        std::env::var("CORS_MAX_AGE")
            .expect("Unable to get CORS_MAX_AGE")
            .parse::<usize>()
            .expect("CORS_MAX_AGE is invalid")
    });

    pub static PASSWORD_SECRET_KEY: Lazy<String> = Lazy::new(|| {
        std::env::var("PASSWORD_SECRET_KEY").expect("Unable to get PASSWORD_SECRET_KEY")
    });

    pub static REMEMBER_DIGEST_SECRET_KEY: Lazy<String> = Lazy::new(|| {
        std::env::var("REMEMBER_DIGEST_SECRET_KEY")
            .expect("Unable to get REMEMBER_DIGEST_SECRET_KEY")
    });

    pub static REMEMBER_CIPHER_PASSWORD: Lazy<String> = Lazy::new(|| {
        std::env::var("REMEMBER_CIPHER_PASSWORD").expect("Unable to get REMEMBER_CIPHER_PASSWORD")
    });

    pub static REMEMBER_MAX_DAYS: Lazy<i64> = Lazy::new(|| {
        std::env::var("REMEMBER_MAX_DAYS")
            .expect("Unable to get REMEMBER_MAX_DAYS")
            .parse::<i64>()
            .expect("REMEMBER_MAX_DAYS is invalid")
    });

    pub const REMEMBER_TOKEN_COOKIE_NAME: &str = "remember_token";

    pub const SESSION_USER_KEY: &str = "___authenticated_user";
}

pub mod user {
    pub mod role {
        pub const ADMIN: i32 = 1;
        pub const USER: i32 = 2;
    }
    pub mod status {
        pub const ACTIVE: i32 = 1;
        pub const DELETED: i32 = 2;
        pub const _UNAPPROVED: i32 = 3;
    }
}

pub mod contact {
    pub mod status {
        pub const UNAPPROVED: i32 = 1;
        pub const APPROVED: i32 = 2;
        pub const DELETED: i32 = 3;
    }
}

pub mod message {
    pub mod category {
        pub const CONTACT_APPLICATION: i32 = 1;
        pub const CONTACT_APPROVAL: i32 = 2;
        pub const MESSAGE: i32 = 3;
        pub const _CALLING: i32 = 4;
        pub const _FILE_TRANSMISSION: i32 = 5;
    }
    pub mod status {
        pub const UNREAD: i32 = 1;
        pub const READ: i32 = 2;
        pub const DELETED: i32 = 3;
    }
}
