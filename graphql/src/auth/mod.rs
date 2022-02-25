mod user;

use actix_session::Session;
pub use user::*;

const SESSION_USER_KEY: &str = "authenticated_user";

pub enum Sign {
    In(Identity),
    Out,
}

pub fn handle(proc: &Sign, session: &Session) {
    match proc {
        Sign::In(user) => sign_in(user, session),
        Sign::Out => sign_out(session),
    }
}

pub fn get_identity(session: &Session) -> Option<Identity> {
    match session.get::<Identity>(SESSION_USER_KEY) {
        Ok(option_identity) => option_identity,
        Err(e) => panic!("Error while actix session processing: {}", e),
    }
}

fn sign_in(user: &Identity, session: &Session) {
    match session.insert(SESSION_USER_KEY, user) {
        Ok(()) => session.renew(),
        Err(e) => panic!("Error while actix session processing: {}", e),
    }
}

fn sign_out(session: &Session) {
    match get_identity(session) {
        Some(_) => session.purge(),
        None => (),
    }
}
