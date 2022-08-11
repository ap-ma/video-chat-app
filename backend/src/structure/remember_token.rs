use crate::constant::system::remember::TOKEN_COOKIE_NAME;
use actix_web::HttpRequest;

pub struct RememberToken(pub Option<String>);

impl RememberToken {
    pub fn new(req: &HttpRequest) -> Self {
        let remember_token = req.cookies().ok().and_then(|cookies| {
            cookies
                .iter()
                .find(|&cookie| cookie.name() == TOKEN_COOKIE_NAME)
                .map(|remember_token| remember_token.value().to_owned())
        });

        RememberToken(remember_token)
    }
}
