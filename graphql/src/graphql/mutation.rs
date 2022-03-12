use super::common::{self, MutationType, SimpleBroker};
use super::form::{SignInInput, SignUpInput};
use super::model::{Contact, Message, MessageChanged};
use super::security::{password, random, RoleGuard};
use crate::auth::Role;
use crate::constants::{contact as contact_const, message as message_const, user as user_const};
use crate::database::entity::{
    ChangeContactEntity, ContactEntity, NewContactEntity, NewMessageEntity, NewUserEntity,
};
use crate::database::service;
use async_graphql::*;
use diesel::connection::Connection;

pub struct Mutation;

#[Object]
impl Mutation {
    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn sign_in(&self, ctx: &Context<'_>, input: SignInInput) -> bool {
        let conn = common::get_conn_from_ctx(ctx);
        if let Some(user) = service::find_user_by_email(&input.email, &conn).ok() {
            if let Ok(matching) = password::verify(&user.password, &input.password, &user.secret) {
                if matching {
                    common::sign_in(&user, ctx);
                    return true;
                }
            }
        }
        false
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn sign_out(&self, ctx: &Context<'_>) -> bool {
        common::sign_out(ctx);
        true
    }

    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn sign_up(&self, ctx: &Context<'_>, input: SignUpInput) -> Result<bool> {
        let conn = common::get_conn_from_ctx(ctx);
        if let Some(_) = service::find_user_by_email(&input.email, &conn).ok() {
            return Err(Error::new("Email has already been registered"));
        }
        if let Some(_) = service::find_user_by_code(&input.code, &conn).ok() {
            return Err(Error::new("Code has already been registered"));
        }

        let secret = random::gen(50);
        let password = password::hash(input.password.as_str(), &secret)
            .expect("Failed to create password hash");
        let new_user = NewUserEntity {
            code: input.code,
            name: Some(input.name),
            email: input.email,
            password,
            secret,
            comment: input.comment,
            avatar: input.avatar,
            role: user_const::role::USER,
            status: user_const::status::ACTIVE,
        };

        let user = conn.transaction::<_, diesel::result::Error, _>(|| {
            let user = service::create_user(new_user, &conn).expect("Failed to create user");
            // myself
            create_contact(user.id, user.id, ctx);
            Ok(user)
        })?;

        common::sign_in(&user, ctx);

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_application(&self, ctx: &Context<'_>, other_user_id: u64) -> Result<Message> {
        let conn = common::get_conn_from_ctx(ctx);

        let identity = common::get_identity_from_ctx(ctx).expect("Unable to get signed-in user");
        if let Some(_) = service::find_contact_with_user(identity.id, other_user_id, &conn).ok() {
            return Err(Error::new("Contact is already registered"));
        }

        let message = create_message(
            other_user_id,
            message_const::category::CONTACT_APPLICATION,
            None,
            ctx,
        );

        Ok(message)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_approval(&self, ctx: &Context<'_>, message_id: u64) -> Result<Message> {
        let conn = common::get_conn_from_ctx(ctx);
        let identity = common::get_identity_from_ctx(ctx).expect("Unable to get signed-in user");

        if let Some(message) = service::find_message_by_id(message_id, &conn).ok() {
            // 指定のメッセージがコンタクト申請でない
            if message.category != message_const::category::CONTACT_APPLICATION {
                return Err(Error::new("Message is not a contact application message"));
            }
            // コンタクト申請対象がサインインユーザーでない
            if message.rx_user_id != identity.id {
                return Err(Error::new("Invalid contact application message id"));
            }
            if let Ok(_) = service::find_contact_with_user(identity.id, message.tx_user_id, &conn) {
                return Err(Error::new("Contact is already registered"));
            }

            create_contact(identity.id, message.rx_user_id, ctx);
            create_contact(message.rx_user_id, identity.id, ctx);

            let message = create_message(
                message.rx_user_id,
                message_const::category::CONTACT_APPROVAL,
                None,
                ctx,
            );

            return Ok(message);
        }

        Err(Error::new("Unable to get contact application message"))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_delete(&self, ctx: &Context<'_>, contact_id: u64) -> Result<Contact> {
        let conn = common::get_conn_from_ctx(ctx);
        let identity = common::get_identity_from_ctx(ctx).expect("Unable to get signed-in user");
        if let Some(contact) = service::find_contact_by_id(contact_id, &conn).ok() {
            // コンタクトがサインインユーザーのものでない
            if contact.user_id != identity.id {
                return Err(Error::new("Invalid contact id"));
            }
            if contact.status == contact_const::status::DELETED {
                return Err(Error::new("Contact has already been deleted"));
            }

            let contact_change = ChangeContactEntity {
                id: contact_id,
                status: Some(contact_const::status::DELETED),
                ..Default::default()
            };
            service::update_contact(contact_change, &conn).expect("Failed to update the contact");

            let contact =
                service::find_contact_with_user(identity.id, contact.contact_user_id, &conn)
                    .expect("Failed to get the contact");

            return Ok(Contact::from(&contact));
        }

        Err(Error::new("Unable to get contact"))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_undelete(&self, ctx: &Context<'_>, contact_id: u64) -> Result<Contact> {
        let conn = common::get_conn_from_ctx(ctx);
        let identity = common::get_identity_from_ctx(ctx).expect("Unable to get signed-in user");
        if let Some(contact) = service::find_contact_by_id(contact_id, &conn).ok() {
            // コンタクトがサインインユーザーのものでない
            if contact.user_id != identity.id {
                return Err(Error::new("Invalid contact id"));
            }
            if contact.status != contact_const::status::DELETED {
                return Err(Error::new("Contacts have not been deleted"));
            }

            let contact_change = ChangeContactEntity {
                id: contact_id,
                status: Some(contact_const::status::APPROVED),
                ..Default::default()
            };
            service::update_contact(contact_change, &conn).expect("Failed to update the contact");

            let contact =
                service::find_contact_with_user(identity.id, contact.contact_user_id, &conn)
                    .expect("Failed to get the contact");

            return Ok(Contact::from(&contact));
        }

        Err(Error::new("Unable to get contact"))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_block(&self, ctx: &Context<'_>, contact_id: u64) -> Result<Contact> {
        let conn = common::get_conn_from_ctx(ctx);
        let identity = common::get_identity_from_ctx(ctx).expect("Unable to get signed-in user");
        if let Some(contact) = service::find_contact_by_id(contact_id, &conn).ok() {
            // コンタクトがサインインユーザーのものでない
            if contact.user_id != identity.id {
                return Err(Error::new("Invalid contact id"));
            }
            if contact.blocked {
                return Err(Error::new("Contact has already been blocked"));
            }

            let contact_change = ChangeContactEntity {
                id: contact_id,
                blocked: Some(true),
                ..Default::default()
            };
            service::update_contact(contact_change, &conn).expect("Failed to update the contact");

            let contact =
                service::find_contact_with_user(identity.id, contact.contact_user_id, &conn)
                    .expect("Failed to get the contact");

            return Ok(Contact::from(&contact));
        }

        Err(Error::new("Unable to get contact"))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_unblock(&self, ctx: &Context<'_>, contact_id: u64) -> Result<Contact> {
        let conn = common::get_conn_from_ctx(ctx);
        let identity = common::get_identity_from_ctx(ctx).expect("Unable to get signed-in user");
        if let Some(contact) = service::find_contact_by_id(contact_id, &conn).ok() {
            // コンタクトがサインインユーザーのものでない
            if contact.user_id != identity.id {
                return Err(Error::new("Invalid contact id"));
            }
            if !contact.blocked {
                return Err(Error::new("Contact is not blocked"));
            }

            let contact_change = ChangeContactEntity {
                id: contact_id,
                blocked: Some(false),
                ..Default::default()
            };
            service::update_contact(contact_change, &conn).expect("Failed to update the contact");

            let contact =
                service::find_contact_with_user(identity.id, contact.contact_user_id, &conn)
                    .expect("Failed to get the contact");

            return Ok(Contact::from(&contact));
        }

        Err(Error::new("Unable to get contact"))
    }
}

fn create_contact(user_id: u64, contact_user_id: u64, ctx: &Context<'_>) -> ContactEntity {
    let conn = common::get_conn_from_ctx(ctx);
    let new_contact = NewContactEntity {
        user_id: user_id,
        contact_user_id: contact_user_id,
        status: contact_const::status::APPROVED,
        blocked: false,
    };
    service::create_contact(new_contact, &conn).expect("Failed to create contact")
}

fn create_message(
    rx_user_id: u64,
    category: i32,
    message: Option<String>,
    ctx: &Context<'_>,
) -> Message {
    let conn = common::get_conn_from_ctx(ctx);
    let identity = common::get_identity_from_ctx(ctx).expect("Unable to get signed-in user");
    let new_message = NewMessageEntity {
        tx_user_id: identity.id,
        rx_user_id,
        category,
        message,
        status: message_const::status::UNREAD,
    };
    let message = service::create_message(new_message, &conn).expect("Failed to create message");

    SimpleBroker::publish(MessageChanged {
        id: message.id.into(),
        tx_user_id: message.tx_user_id.into(),
        rx_user_id: message.rx_user_id.into(),
        mutation_type: MutationType::Created,
    });

    Message::from(&message)
}
