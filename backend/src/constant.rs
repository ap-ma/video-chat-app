pub mod user {
    pub mod role {
        pub const ADMIN: i32 = 1;
        pub const USER: i32 = 2;
    }
    pub mod status {
        pub const ACTIVE: i32 = 1;
        pub const DELETED: i32 = 2;
        pub const UNVERIFIED: i32 = 3;
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
        pub const CALLING: i32 = 4;
        pub const _FILE_TRANSMISSION: i32 = 5;
    }
    pub mod status {
        pub const UNREAD: i32 = 1;
        pub const READ: i32 = 2;
        pub const DELETED: i32 = 3;
    }
}

pub mod call {
    pub mod status {
        pub const OFFER: i32 = 1;
        pub const _DURING: i32 = 2;
        pub const _TERMINATED: i32 = 3;
        pub const _CANCELED: i32 = 3;
    }
}

pub mod email_verification_token {
    pub mod category {
        pub const CREATE: i32 = 1;
        pub const UPDATE: i32 = 2;
    }
}

pub mod system {
    use once_cell::sync::Lazy;

    pub static APP_NAME: Lazy<String> =
        Lazy::new(|| std::env::var("APP_NAME").expect("Unable to get APP_NAME"));

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

    pub const DEFAULT_DATETIME_FORMAT: &str = "%m/%d/%Y %H:%M:%S";

    pub const VERIFICATION_TOKEN_LEN: usize = 50;

    pub mod session {
        pub const AUTHENTICATED_USER_KEY: &str = "___authenticated_user";
    }

    pub mod validation {
        // 平均4バイト想定 50文字前後
        pub const USER_COMMENT_MAX_LEN: usize = 200;

        // 最低4文字 最大8文字 半角英数字
        pub const CODE_PATTERN: &str = r"^[a-zA-Z0-9]{4,8}$";

        // 最低8文字 最大24文字 大文字、小文字、数字をそれぞれ1文字以上含む半角英数字
        pub const PASSWORD_PATTERN: &str = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,24}$";
    }

    pub mod password {
        use super::Lazy;

        pub static SECRET_KEY: Lazy<String> = Lazy::new(|| {
            std::env::var("PASSWORD_SECRET_KEY").expect("Unable to get PASSWORD_SECRET_KEY")
        });
    }

    pub mod password_reset {
        use super::Lazy;

        pub static DIGEST_SECRET_KEY: Lazy<String> = Lazy::new(|| {
            std::env::var("PASSWORD_RESET_DIGEST_SECRET_KEY")
                .expect("Unable to get PASSWORD_RESET_DIGEST_SECRET_KEY")
        });

        pub static CIPHER_PASSWORD: Lazy<String> = Lazy::new(|| {
            std::env::var("PASSWORD_RESET_CIPHER_PASSWORD")
                .expect("Unable to get PASSWORD_RESET_CIPHER_PASSWORD")
        });

        pub static FRONT_PATH: Lazy<String> = Lazy::new(|| {
            std::env::var("PASSWORD_RESET_FRONT_PATH")
                .expect("Unable to get PASSWORD_RESET_FRONT_PATH")
        });

        pub static LINK_MAX_MINUTES: Lazy<i64> = Lazy::new(|| {
            std::env::var("PASSWORD_RESET_LINK_MAX_MINUTES")
                .expect("Unable to get PASSWORD_RESET_LINK_MAX_MINUTES")
                .parse::<i64>()
                .expect("PASSWORD_RESET_LINK_MAX_MINUTES is invalid")
        });
    }

    pub mod email_verification {
        use super::Lazy;

        pub static DIGEST_SECRET_KEY: Lazy<String> = Lazy::new(|| {
            std::env::var("EMAIL_VERIFICATION_DIGEST_SECRET_KEY")
                .expect("Unable to get EMAIL_VERIFICATION_DIGEST_SECRET_KEY")
        });

        pub static CIPHER_PASSWORD: Lazy<String> = Lazy::new(|| {
            std::env::var("EMAIL_VERIFICATION_CIPHER_PASSWORD")
                .expect("Unable to get EMAIL_VERIFICATION_CIPHER_PASSWORD")
        });

        pub static FRONT_PATH: Lazy<String> = Lazy::new(|| {
            std::env::var("EMAIL_VERIFICATION_FRONT_PATH")
                .expect("Unable to get EMAIL_VERIFICATION_FRONT_PATH")
        });

        pub static LINK_MAX_MINUTES: Lazy<i64> = Lazy::new(|| {
            std::env::var("EMAIL_VERIFICATION_LINK_MAX_MINUTES")
                .expect("Unable to get EMAIL_VERIFICATION_LINK_MAX_MINUTES")
                .parse::<i64>()
                .expect("EMAIL_VERIFICATION_LINK_MAX_MINUTES is invalid")
        });
    }

    pub mod mail {
        use super::Lazy;

        pub static HOST: Lazy<String> =
            Lazy::new(|| std::env::var("MAIL_HOST").expect("Unable to get MAIL_HOST"));

        pub static USERNAME: Lazy<String> =
            Lazy::new(|| std::env::var("MAIL_USERNAME").expect("Unable to get MAIL_USERNAME"));

        pub static PASSWORD: Lazy<String> =
            Lazy::new(|| std::env::var("MAIL_PASSWORD").expect("Unable to get MAIL_PASSWORD"));

        pub static FROM_ADDRESS: Lazy<String> = Lazy::new(|| {
            std::env::var("MAIL_FROM_ADDRESS").expect("Unable to get MAIL_FROM_ADDRESS")
        });

        pub static FROM_NAME: Lazy<String> =
            Lazy::new(|| std::env::var("MAIL_FROM_NAME").expect("Unable to get MAIL_FROM_NAME"));
    }

    pub mod remember {
        use super::Lazy;

        pub const TOKEN_COOKIE_NAME: &str = "remember_token";

        pub static DIGEST_SECRET_KEY: Lazy<String> = Lazy::new(|| {
            std::env::var("REMEMBER_DIGEST_SECRET_KEY")
                .expect("Unable to get REMEMBER_DIGEST_SECRET_KEY")
        });

        pub static CIPHER_PASSWORD: Lazy<String> = Lazy::new(|| {
            std::env::var("REMEMBER_CIPHER_PASSWORD")
                .expect("Unable to get REMEMBER_CIPHER_PASSWORD")
        });

        pub static MAX_DAYS: Lazy<i64> = Lazy::new(|| {
            std::env::var("REMEMBER_MAX_DAYS")
                .expect("Unable to get REMEMBER_MAX_DAYS")
                .parse::<i64>()
                .expect("REMEMBER_MAX_DAYS is invalid")
        });
    }
}
