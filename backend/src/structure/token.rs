use crate::constant::system::REMEMBER_TOKEN_COOKIE_NAME;
use actix_web::HttpRequest;

pub struct RememberToken(pub Option<String>);

impl RememberToken {
    pub fn new(req: &HttpRequest) -> Self {
        if let Some(cookies) = req.cookies().ok() {
            let remember_token = cookies
                .iter()
                .find(|&cookie| cookie.name() == REMEMBER_TOKEN_COOKIE_NAME)
                .map(|remember_token| remember_token.value().to_owned());

            return RememberToken(remember_token);
        };

        RememberToken(None)
    }
}
