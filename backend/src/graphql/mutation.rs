use super::common::{self, MutationType, SimpleBroker};
use super::form::{
    ChangePasswordInput, EditProfileInput, SendMessageInput, SignInInput, SignUpInput,
};
use super::model::{Contact, Message, MessageChanged, User};
use super::security::auth::{self, Role};
use super::security::crypto::{hash, random};
use super::security::{self, validator, RoleGuard};
use super::GraphqlError;
use crate::constant::system::validation::USER_COMMENT_MAX_LEN;
use crate::constant::{contact as contact_const, message as message_const, user as user_const};
use crate::database::entity::{
    ChangeContactEntity, ChangeMessageEntity, ChangeUserEntity, ContactEntity, NewContactEntity,
    NewMessageEntity, NewUserEntity,
};
use crate::database::service;
use async_graphql::*;
use diesel::connection::Connection;

pub struct Mutation;

#[Object]
impl Mutation {
    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn sign_in(&self, ctx: &Context<'_>, input: SignInInput) -> Result<bool> {
        let conn = common::get_conn(ctx)?;

        if let Ok(user) = service::find_user_by_email(&input.email, None, &conn) {
            let matching = security::password_verify(&user.password, &input.password);
            if matching.unwrap_or(false) {
                auth::sign_in(&user, ctx)?;
                auth::remember(user.id, &input.remember_me, ctx)?;
                return Ok(true);
            }
        }

        let m = "Incorrect Email address or Password.";
        let e = GraphqlError::ValidationError(m.into(), "email, password");
        Err(e.extend())
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn sign_out(&self, ctx: &Context<'_>) -> Result<bool> {
        auth::sign_out(ctx)?;
        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn sign_up(&self, ctx: &Context<'_>, input: SignUpInput) -> Result<bool> {
        let conn = common::get_conn(ctx)?;

        validator::code_validator("code", &input.code, None, &conn)?;
        validator::email_validator("email", &input.email, None, &conn)?;
        validator::max_length_validator("comment", &input.comment, USER_COMMENT_MAX_LEN)?;
        validator::password_validator(
            "password",
            "password_confirm",
            &input.password,
            &input.password_confirm,
        )?;

        let password = security::password_hash(input.password.as_str()).map_err(|e| {
            let m = "Failed to create password hash";
            GraphqlError::ServerError(m.into(), e.to_string()).extend()
        })?;

        let new_user = NewUserEntity {
            code: input.code,
            name: Some(input.name),
            email: input.email,
            password,
            comment: input.comment,
            avatar: input.avatar,
            role: user_const::role::USER,
            status: user_const::status::UNVERIFIED,
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

        auth::sign_in(&user, ctx)?;

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn edit_profile(&self, ctx: &Context<'_>, input: EditProfileInput) -> Result<User> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        validator::code_validator("code", &input.code, Some(identity.id), &conn)?;
        validator::email_validator("email", &input.email, Some(identity.id), &conn)?;
        validator::max_length_validator("comment", &input.comment, USER_COMMENT_MAX_LEN)?;

        let change_user = ChangeUserEntity {
            id: identity.id,
            code: Some(input.code),
            name: Some(Some(input.name)),
            email: Some(input.email),
            comment: Some(input.comment),
            avatar: Some(input.avatar),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_user(change_user, &conn),
            "Failed to update user",
        )?;

        let user = common::convert_query_result(
            service::find_user_by_id(identity.id, &conn),
            "Failed to get the user",
        )?;

        Ok(User::from(&user))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn change_password(&self, ctx: &Context<'_>, input: ChangePasswordInput) -> Result<bool> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let user = common::convert_query_result(
            service::find_user_by_id(identity.id, &conn),
            "Failed to get user",
        )?;

        let matching = security::password_verify(&user.password, &input.password);
        if !matching.unwrap_or(false) {
            let e = GraphqlError::ValidationError("Password is incorrect.".into(), "password");
            return Err(e.extend());
        }

        validator::password_validator(
            "new_password",
            "new_password_confirm",
            &input.new_password,
            &input.new_password_confirm,
        )?;

        let password = security::password_hash(input.password.as_str()).map_err(|e| {
            let m = "Failed to create password hash";
            GraphqlError::ServerError(m.into(), e.to_string()).extend()
        })?;

        let change_user = ChangeUserEntity {
            id: identity.id,
            password: Some(password),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_user(change_user, &conn),
            "Failed to update user",
        )?;

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn delete_account(&self, ctx: &Context<'_>) -> Result<bool> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let change_user = ChangeUserEntity {
            id: identity.id,
            status: Some(user_const::status::DELETED),
            ..Default::default()
        };

        conn.transaction::<_, Error, _>(|| {
            let count = common::convert_query_result(
                service::update_user(change_user, &conn),
                "Failed to update user",
            )?;

            if count != 1 {
                let m = "The process was terminated due to an unexpected error.";
                let d = format!("Database status is invalid. There were {} updates.", count);
                let e = GraphqlError::ServerError(m.into(), d);
                return Err(e.extend());
            }

            Ok(())
        })?;

        auth::sign_out(ctx)?;

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn send_message(
        &self,
        ctx: &Context<'_>,
        input: SendMessageInput,
    ) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let contact = service::find_contact_by_id(common::convert_id(&input.contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError("Unable to get contact.".into(), "contact_id").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError("Invalid contact id".into(), "contact_id");
            return Err(e.extend());
        }

        if contact_const::status::DELETED == contact.status {
            let e = GraphqlError::ValidationError("Contact has been deleted.".into(), "contact_id");
            return Err(e.extend());
        }

        if contact.blocked {
            let e = GraphqlError::ValidationError("Cntact is blocked".into(), "contact_id");
            return Err(e.extend());
        }

        let message_changed = create_message(
            contact.contact_user_id,
            message_const::category::MESSAGE,
            Some(input.message),
            Some(contact.id),
            Some(contact.status),
            ctx,
        )?;

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn delete_message(&self, ctx: &Context<'_>, message_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let message = service::find_message_by_id(common::convert_id(&message_id)?, &conn);
        let message = message.map_err(|_| {
            GraphqlError::ValidationError("Unable to get message".into(), "message_id").extend()
        })?;

        if message.tx_user_id != identity.id {
            let e = GraphqlError::ValidationError("Invalid message id".into(), "message_id");
            return Err(e.extend());
        }

        if message_const::status::DELETED == message.status {
            let m = "Message has already been deleted";
            let e = GraphqlError::ValidationError(m.into(), "contact_id");
            return Err(e.extend());
        }

        let mut contact_id = None;
        let mut contact_status = None;

        let contact = service::find_contact_with_user(identity.id, message.rx_user_id, &conn);
        if let Ok((contact, _)) = contact {
            contact_id = Some(contact.id);
            contact_status = Some(contact.status);
        }

        let change_message = ChangeMessageEntity {
            id: message.id,
            status: Some(message_const::status::DELETED),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_message(change_message, &conn),
            "Failed to update message",
        )?;

        let message = common::convert_query_result(
            service::find_message_by_id(message.id, &conn),
            "Failed to get message",
        )?;

        let message_changed = MessageChanged {
            tx_user_id: message.tx_user_id,
            rx_user_id: message.rx_user_id,
            contact_id,
            contact_status,
            message: Some(Message::from(&message)),
            messages: None,
            mutation_type: MutationType::Deleted,
        };

        let rx_user_contact =
            service::find_contact_with_user(message.tx_user_id, message.rx_user_id, &conn);

        if let Some(rx_user_contact) = rx_user_contact.ok() {
            if !(rx_user_contact.0.blocked) {
                publish_message(&message_changed);
            }
        }

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn read_messages(&self, ctx: &Context<'_>, other_user_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let other_user_id = common::convert_id(&other_user_id)?;

        let mut contact_id = None;
        let mut contact_status = None;

        let contact = service::find_contact_with_user(identity.id, other_user_id, &conn);
        if let Ok((contact, _)) = contact {
            if contact.blocked {
                let e = GraphqlError::ValidationError("Cntact is blocked".into(), "other_user_id");
                return Err(e.extend());
            }

            contact_id = Some(contact.id);
            contact_status = Some(contact.status);
        }

        let targets = common::convert_query_result(
            service::get_unread_messages(identity.id, other_user_id, &conn),
            "Failed to get messages",
        )?;

        common::convert_query_result(
            service::update_message_to_read(identity.id, other_user_id, &conn),
            "Failed to update messages",
        )?;

        let messages = targets.iter().map(Message::from).collect();
        let message_changed = MessageChanged {
            tx_user_id: identity.id,
            rx_user_id: other_user_id,
            contact_id,
            contact_status,
            message: None,
            messages: Some(messages),
            mutation_type: MutationType::Updated,
        };

        let contact_user_contact =
            service::find_contact_with_user(other_user_id, identity.id, &conn);

        if let Some(contact_user_contact) = contact_user_contact.ok() {
            if !(contact_user_contact.0.blocked) {
                publish_message(&message_changed)
            }
        }

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_application(
        &self,
        ctx: &Context<'_>,
        other_user_id: ID,
    ) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let other_user_id = common::convert_id(&other_user_id)?;

        let contact = service::find_contact_with_user(identity.id, other_user_id, &conn);
        if contact.is_ok() {
            let m = "Contact is already registered";
            let e = GraphqlError::ValidationError(m.into(), "other_user_id");
            return Err(e.extend());
        }

        let message_changed = create_message(
            other_user_id,
            message_const::category::CONTACT_APPLICATION,
            None,
            None,
            None,
            ctx,
        )?;

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_approval(&self, ctx: &Context<'_>, message_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let message = service::find_message_by_id(common::convert_id(&message_id)?, &conn);
        let message = message.map_err(|_| {
            let m = "Unable to get contact application message";
            let e = GraphqlError::ValidationError(m.into(), "message_id");
            e.extend()
        })?;

        if message_const::category::CONTACT_APPLICATION != message.category {
            let m = "Message is not a contact application message";
            let e = GraphqlError::ValidationError(m.into(), "message_id");
            return Err(e.extend());
        }

        if message.rx_user_id != identity.id {
            let m = "Invalid contact application message id";
            let e = GraphqlError::ValidationError(m.into(), "message_id");
            return Err(e.extend());
        }

        let contact = service::find_contact_with_user(identity.id, message.tx_user_id, &conn);
        if contact.is_ok() {
            let m = "Contact is already registered";
            let e = GraphqlError::ValidationError(m.into(), "message_id");
            return Err(e.extend());
        }

        let message_changed = conn.transaction::<_, Error, _>(|| {
            let contact = create_contact(identity.id, message.rx_user_id, ctx)?;
            create_contact(message.rx_user_id, identity.id, ctx)?;
            let message_changed = create_message(
                message.rx_user_id,
                message_const::category::CONTACT_APPROVAL,
                None,
                Some(contact.id),
                Some(contact.status),
                ctx,
            )?;

            Ok(message_changed)
        })?;

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn delete_contact(&self, ctx: &Context<'_>, contact_id: ID) -> Result<Contact> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError("Unable to get contact".into(), "contact_id").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError("Invalid contact id".into(), "contact_id");
            return Err(e.extend());
        }

        if contact_const::status::DELETED == contact.status {
            let m = "Contact has already been deleted";
            let e = GraphqlError::ValidationError(m.into(), "contact_id");
            return Err(e.extend());
        }

        let change_contact = ChangeContactEntity {
            id: contact.id,
            status: Some(contact_const::status::DELETED),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_contact(change_contact, &conn),
            "Failed to update contact",
        )?;

        let contact = common::convert_query_result(
            service::find_contact_with_user(identity.id, contact.contact_user_id, &conn),
            "Failed to get contact",
        )?;

        Ok(Contact::from(&contact))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn undelete_contact(&self, ctx: &Context<'_>, contact_id: ID) -> Result<Contact> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError("Unable to get contact".into(), "contact_id").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError("Invalid contact id".into(), "contact_id");
            return Err(e.extend());
        }

        if contact_const::status::DELETED != contact.status {
            let m = "Contacts have not been deleted";
            let e = GraphqlError::ValidationError(m.into(), "contact_id");
            return Err(e.extend());
        }

        let change_contact = ChangeContactEntity {
            id: contact.id,
            status: Some(contact_const::status::APPROVED),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_contact(change_contact, &conn),
            "Failed to update contact",
        )?;

        let contact = common::convert_query_result(
            service::find_contact_with_user(identity.id, contact.contact_user_id, &conn),
            "Failed to get contact",
        )?;

        Ok(Contact::from(&contact))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn block_contact(&self, ctx: &Context<'_>, contact_id: ID) -> Result<Contact> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError("Unable to get contact".into(), "contact_id").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError("Invalid contact id".into(), "contact_id");
            return Err(e.extend());
        }

        if contact.blocked {
            let e = GraphqlError::ValidationError(
                "Contact has already been blocked".into(),
                "contact_id",
            );
            return Err(e.extend());
        }

        let change_contact = ChangeContactEntity {
            id: contact.id,
            blocked: Some(true),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_contact(change_contact, &conn),
            "Failed to update contact",
        )?;

        let contact = common::convert_query_result(
            service::find_contact_with_user(identity.id, contact.contact_user_id, &conn),
            "Failed to get contact",
        )?;

        Ok(Contact::from(&contact))
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn unblock_contact(&self, ctx: &Context<'_>, contact_id: ID) -> Result<Contact> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError("Unable to get contact".into(), "contact_id").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError("Invalid contact id".into(), "contact_id");
            return Err(e.extend());
        }

        if !contact.blocked {
            let e = GraphqlError::ValidationError("Contact is not blocked".into(), "contact_id");
            return Err(e.extend());
        }

        let change_contact = ChangeContactEntity {
            id: contact.id,
            blocked: Some(false),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_contact(change_contact, &conn),
            "Failed to update contact",
        )?;

        let contact = common::convert_query_result(
            service::find_contact_with_user(identity.id, contact.contact_user_id, &conn),
            "Failed to get contact",
        )?;

        Ok(Contact::from(&contact))
    }
}

fn create_contact(user_id: u64, contact_user_id: u64, ctx: &Context<'_>) -> Result<ContactEntity> {
    let conn = common::get_conn(ctx)?;

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
    contact_id: Option<u64>,
    contact_status: Option<i32>,
    ctx: &Context<'_>,
) -> Result<MessageChanged> {
    let conn = common::get_conn(ctx)?;
    let identity = auth::get_identity(ctx)?;
    let identity = identity.ok_or_else(|| GraphqlError::AuthenticationError.extend())?;

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

    let message_changed = MessageChanged {
        tx_user_id: message.tx_user_id,
        rx_user_id: message.rx_user_id,
        contact_id,
        contact_status,
        message: Some(Message::from(&message)),
        messages: None,
        mutation_type: MutationType::Created,
    };

    let rx_user_contact = service::find_contact_with_user(rx_user_id, identity.id, &conn).ok();
    if let Some(rx_user_contact) = rx_user_contact {
        if !(rx_user_contact.0.blocked) {
            publish_message(&message_changed)
        }
    }

    Ok(message_changed)
}

fn publish_message(message_changed: &MessageChanged) {
    SimpleBroker::publish(message_changed.clone());
}
