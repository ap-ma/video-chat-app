use crate::constant::system::mail::{FROM_ADDRESS, FROM_NAME, HOST, PASSWORD, PORT, USERNAME};
use async_graphql::Result;
use lettre::transport::smtp::{authentication::Credentials, response::Response};
use lettre::{message::Mailbox, Address, Message, SmtpTransport, Transport};

pub fn send_mail(to_address: &str, to_name: &str, subject: &str, body: String) -> Result<Response> {
    let from_address = FROM_ADDRESS.parse::<Address>()?;
    let from = Mailbox::new(Some(FROM_NAME.clone()), from_address);

    let to_address = to_address.parse::<Address>()?;
    let to = Mailbox::new(Some(to_name.to_owned()), to_address);

    let email = Message::builder()
        .from(from)
        .to(to)
        .subject(subject)
        .body(body)?;

    let creds = Credentials::new(USERNAME.clone(), PASSWORD.clone());

    // Open a remote connection to gmail
    let mailer = SmtpTransport::relay(&HOST)?
        .credentials(creds)
        .port(*PORT)
        .build();

    // Send the email
    let response = mailer.send(&email)?;
    Ok(response)
}
