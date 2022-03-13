use super::common::{self, MutationType, SimpleBroker};
use super::form::{SignInInput, SignUpInput};
use super::model::{Contact, Message, MessageChanged};
use super::security::{password, random, validator, RoleGuard};
use super::GraphqlError;
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
    async fn sign_in(&self, ctx: &Context<'_>, input: SignInInput) -> Result<bool> {
        let conn = common::get_conn_from_ctx(ctx)?;
        if let Some(user) = service::find_user_by_email(&input.email, None, &conn).ok() {
            if let Ok(matching) = password::verify(&user.password, &input.password, &user.secret) {
                if matching {
                    common::sign_in(&user, ctx);
                    return Ok(true);
                }
            }
        }
        Ok(false)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn sign_out(&self, ctx: &Context<'_>) -> bool {
        common::sign_out(ctx);
        true
    }

    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn sign_up(&self, ctx: &Context<'_>, input: SignUpInput) -> Result<bool> {
        let conn = common::get_conn_from_ctx(ctx)?;

        validator::code_validator("code", &input.code, None, &conn)?;
        validator::email_validator("email", &input.email, None, &conn)?;
        validator::password_validator("password", &input.password)?;
        if let Some(comment) = &input.comment {
            validator::max_length_validator("comment", comment, 200)?; // 平均4バイト想定 50文字前後
        }

        let secret = random::gen(50);
        let password = password::hash(input.password.as_str(), &secret);
        if let Err(e) = password {
            return Err(GraphqlError::ServerError(
                "Failed to create password hash".into(),
                format!("{}", e),
            )
            .extend());
        }

        let password = password.unwrap();
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

        let user = conn.transaction::<_, Error, _>(|| {
            let user = common::convert_query_result(
                service::create_user(new_user, &conn),
                "Failed to create user",
            )?;
            // myself
            create_contact(user.id, user.id, ctx)?;
            Ok(user)
        })?;

        common::sign_in(&user, ctx);

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_application(&self, ctx: &Context<'_>, other_user_id: u64) -> Result<Message> {
        let conn = common::get_conn_from_ctx(ctx)?;

        let identity = common::get_identity_from_ctx(ctx).unwrap();
        if let Some(_) = service::find_contact_with_user(identity.id, other_user_id, &conn).ok() {
            return Err(GraphqlError::ValidationError(
                "Contact is already registered".into(),
                "other_user_id",
            )
            .extend());
        }

        let message = create_message(
            other_user_id,
            message_const::category::CONTACT_APPLICATION,
            None,
            ctx,
        )?;

        Ok(message)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_approval(&self, ctx: &Context<'_>, message_id: u64) -> Result<Message> {
        let conn = common::get_conn_from_ctx(ctx)?;
        let identity = common::get_identity_from_ctx(ctx).unwrap();

        if let Some(message) = service::find_message_by_id(message_id, &conn).ok() {
            // 指定のメッセージがコンタクト申請でない
            if message.category != message_const::category::CONTACT_APPLICATION {
                return Err(GraphqlError::ValidationError(
                    "Message is not a contact application message".into(),
                    "message_id",
                )
                .extend());
            }
            // コンタクト申請対象がサインインユーザーでない
            if message.rx_user_id != identity.id {
                return Err(GraphqlError::ValidationError(
                    "Invalid contact application message id".into(),
                    "message_id",
                )
                .extend());
            }
            if let Ok(_) = service::find_contact_with_user(identity.id, message.tx_user_id, &conn) {
                return Err(GraphqlError::ValidationError(
                    "Contact is already registered".into(),
                    "message_id",
                )
                .extend());
            }

            let message = conn.transaction::<_, Error, _>(|| {
                create_contact(identity.id, message.rx_user_id, ctx)?;
                create_contact(message.rx_user_id, identity.id, ctx)?;
                let message = create_message(
                    message.rx_user_id,
                    message_const::category::CONTACT_APPROVAL,
                    None,
                    ctx,
                )?;
                Ok(message)
            })?;

            return Ok(message);
        }

        Err(GraphqlError::ValidationError(
            "Unable to get contact application message".into(),
            "message_id",
        )
        .extend())
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_delete(&self, ctx: &Context<'_>, contact_id: u64) -> Result<Contact> {
        let conn = common::get_conn_from_ctx(ctx)?;
        let identity = common::get_identity_from_ctx(ctx).unwrap();
        if let Some(contact) = service::find_contact_by_id(contact_id, &conn).ok() {
            // コンタクトがサインインユーザーのものでない
            if contact.user_id != identity.id {
                return Err(GraphqlError::ValidationError(
                    "Invalid contact id".into(),
                    "contact_id",
                )
                .extend());
            }
            if contact.status == contact_const::status::DELETED {
                return Err(GraphqlError::ValidationError(
                    "Contact has already been deleted".into(),
                    "contact_id",
                )
                .extend());
            }

            let contact_change = ChangeContactEntity {
                id: contact_id,
                status: Some(contact_const::status::DELETED),
                ..Default::default()
            };
            common::convert_query_result(
                service::update_contact(contact_change, &conn),
                "Failed to update the contact",
            )?;

            let contact = common::convert_query_result(
                service::find_contact_with_user(identity.id, contact.contact_user_id, &conn),
                "Failed to get the contact",
            )?;

            return Ok(Contact::from(&contact));
        }

        Err(GraphqlError::ValidationError("Unable to get contact".into(), "contact_id").extend())
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_undelete(&self, ctx: &Context<'_>, contact_id: u64) -> Result<Contact> {
        let conn = common::get_conn_from_ctx(ctx)?;
        let identity = common::get_identity_from_ctx(ctx).unwrap();
        if let Some(contact) = service::find_contact_by_id(contact_id, &conn).ok() {
            // コンタクトがサインインユーザーのものでない
            if contact.user_id != identity.id {
                return Err(GraphqlError::ValidationError(
                    "Invalid contact id".into(),
                    "contact_id",
                )
                .extend());
            }
            if contact.status != contact_const::status::DELETED {
                return Err(GraphqlError::ValidationError(
                    "Contacts have not been deleted".into(),
                    "contact_id",
                )
                .extend());
            }

            let contact_change = ChangeContactEntity {
                id: contact_id,
                status: Some(contact_const::status::APPROVED),
                ..Default::default()
            };
            common::convert_query_result(
                service::update_contact(contact_change, &conn),
                "Failed to update the contact",
            )?;

            let contact = common::convert_query_result(
                service::find_contact_with_user(identity.id, contact.contact_user_id, &conn),
                "Failed to get the contact",
            )?;

            return Ok(Contact::from(&contact));
        }

        Err(GraphqlError::ValidationError("Unable to get contact".into(), "contact_id").extend())
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_block(&self, ctx: &Context<'_>, contact_id: u64) -> Result<Contact> {
        let conn = common::get_conn_from_ctx(ctx)?;
        let identity = common::get_identity_from_ctx(ctx).unwrap();
        if let Some(contact) = service::find_contact_by_id(contact_id, &conn).ok() {
            // コンタクトがサインインユーザーのものでない
            if contact.user_id != identity.id {
                return Err(GraphqlError::ValidationError(
                    "Invalid contact id".into(),
                    "contact_id",
                )
                .extend());
            }
            if contact.blocked {
                return Err(GraphqlError::ValidationError(
                    "Contact has already been blocked".into(),
                    "contact_id",
                )
                .extend());
            }

            let contact_change = ChangeContactEntity {
                id: contact_id,
                blocked: Some(true),
                ..Default::default()
            };
            common::convert_query_result(
                service::update_contact(contact_change, &conn),
                "Failed to update the contact",
            )?;

            let contact = common::convert_query_result(
                service::find_contact_with_user(identity.id, contact.contact_user_id, &conn),
                "Failed to get the contact",
            )?;

            return Ok(Contact::from(&contact));
        }

        Err(GraphqlError::ValidationError("Unable to get contact".into(), "contact_id").extend())
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_unblock(&self, ctx: &Context<'_>, contact_id: u64) -> Result<Contact> {
        let conn = common::get_conn_from_ctx(ctx)?;
        let identity = common::get_identity_from_ctx(ctx).unwrap();
        if let Some(contact) = service::find_contact_by_id(contact_id, &conn).ok() {
            // コンタクトがサインインユーザーのものでない
            if contact.user_id != identity.id {
                return Err(GraphqlError::ValidationError(
                    "Invalid contact id".into(),
                    "contact_id",
                )
                .extend());
            }
            if !contact.blocked {
                return Err(GraphqlError::ValidationError(
                    "Contact is not blocked".into(),
                    "contact_id",
                )
                .extend());
            }

            let contact_change = ChangeContactEntity {
                id: contact_id,
                blocked: Some(false),
                ..Default::default()
            };
            common::convert_query_result(
                service::update_contact(contact_change, &conn),
                "Failed to update the contact",
            )?;

            let contact = common::convert_query_result(
                service::find_contact_with_user(identity.id, contact.contact_user_id, &conn),
                "Failed to get the contact",
            )?;

            return Ok(Contact::from(&contact));
        }

        Err(GraphqlError::ValidationError("Unable to get contact".into(), "contact_id").extend())
    }
}

fn create_contact(user_id: u64, contact_user_id: u64, ctx: &Context<'_>) -> Result<ContactEntity> {
    let conn = common::get_conn_from_ctx(ctx)?;
    let new_contact = NewContactEntity {
        user_id: user_id,
        contact_user_id: contact_user_id,
        status: contact_const::status::APPROVED,
        blocked: false,
    };

    let contact = common::convert_query_result(
        service::create_contact(new_contact, &conn),
        "Failed to create contact",
    )?;
    Ok(contact)
}

fn create_message(
    rx_user_id: u64,
    category: i32,
    message: Option<String>,
    ctx: &Context<'_>,
) -> Result<Message> {
    let conn = common::get_conn_from_ctx(ctx)?;

    let identity = common::get_identity_from_ctx(ctx);
    if let None = identity {
        return Err(GraphqlError::AuthenticationError.extend());
    }

    let identity = identity.unwrap();
    let new_message = NewMessageEntity {
        tx_user_id: identity.id,
        rx_user_id,
        category,
        message,
        status: message_const::status::UNREAD,
    };
    let message = common::convert_query_result(
        service::create_message(new_message, &conn),
        "Failed to create message",
    )?;

    SimpleBroker::publish(MessageChanged {
        id: message.id.into(),
        tx_user_id: message.tx_user_id.into(),
        rx_user_id: message.rx_user_id.into(),
        mutation_type: MutationType::Created,
    });

    Ok(Message::from(&message))
}
