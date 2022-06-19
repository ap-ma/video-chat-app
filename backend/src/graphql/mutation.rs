use super::common::{self, mail_builder, CallEventType, MutationType, SimpleBroker};
use super::form::{
    CallOfferInput, ChangePasswordInput, EditProfileInput, ResetPasswordInput, SendImageInput,
    SendMessageInput, SignInInput, SignUpInput,
};
use super::model::{CallEvent, Contact, Message, MessageChanged, User};
use super::security::auth::{self, Role};
use super::security::{self, crypto::hash, validator, RoleGuard};
use super::GraphqlError;
use crate::constant::error;
use crate::constant::system::validation::USER_COMMENT_MAX_LEN;
use crate::constant::system::{email_verification, password_reset};
use crate::constant::{
    call as call_const, contact as contact_const,
    email_verification_token as email_verification_token_const, message as message_const,
    user as user_const,
};
use crate::database::entity::{
    ChangeContactEntity, ChangeMessageEntity, ChangeUserEntity, ContactEntity, NewCallEntity,
    NewContactEntity, NewEmailVerificationTokenEntity, NewMessageEntity,
    NewPasswordResetTokenEntity, NewUserEntity,
};
use crate::database::service;
use async_graphql::*;
use chrono::Local;
use diesel::connection::Connection;
use fast_chemail::is_valid_email;

pub struct Mutation;

#[Object]
impl Mutation {
    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn sign_in(&self, ctx: &Context<'_>, input: SignInInput) -> Result<bool> {
        let conn = common::get_conn(ctx)?;

        if let Ok(user) = service::find_user_by_email(&input.email, &conn) {
            let matching = security::password_verify(&user.password, &input.password);
            if matching.unwrap_or(false) {
                auth::sign_in(&user, ctx)?;
                auth::remember(user.id, &input.remember_me, ctx)?;
                return Ok(true);
            }
        }

        let e = GraphqlError::ValidationError(error::V_AUTH_FAILED.into(), "email, password");
        Err(e.extend())
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn sign_out(&self, ctx: &Context<'_>) -> Result<bool> {
        auth::sign_out(ctx).and(Ok(true))
    }

    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn sign_up(&self, ctx: &Context<'_>, input: SignUpInput) -> Result<bool> {
        let conn = common::get_conn(ctx)?;

        let comment = &input.comment.as_deref().unwrap_or("");
        validator::code_validator("code", &input.code, None, &conn)?;
        validator::email_validator("email", &input.email, &conn)?;
        validator::max_length_validator("comment", comment, USER_COMMENT_MAX_LEN)?;
        validator::password_validator(
            "password",
            "passwordConfirm",
            &input.password,
            &input.password_confirm,
        )?;

        let password = security::password_hash(input.password.as_str()).map_err(|e| {
            let m = "Failed to create password hash.";
            GraphqlError::ServerError(m.into(), e.to_string()).extend()
        })?;

        let now = Local::now().naive_local();
        let new_user = NewUserEntity {
            code: input.code,
            name: Some(input.name),
            email: input.email,
            password,
            comment: input.comment,
            avatar: None,
            role: user_const::role::USER,
            status: user_const::status::UNVERIFIED,
            created_at: now,
            updated_at: now,
        };

        conn.transaction::<_, Error, _>(|| {
            let user = common::convert_query_result(
                service::create_user(new_user, &conn),
                "Failed to create user",
            )?;

            // myself
            create_contact(user.id, user.id, ctx)?;

            // email verification token
            let (token_digest, token) = security::create_verification_token(
                user.id,
                &email_verification::DIGEST_SECRET_KEY,
                &email_verification::CIPHER_PASSWORD,
            )?;

            let email_verification_token = NewEmailVerificationTokenEntity {
                user_id: user.id,
                category: email_verification_token_const::category::CREATE,
                email: user.email.to_owned(),
                token: token_digest,
                created_at: Local::now().naive_local(),
            };

            common::convert_query_result(
                service::upsert_email_verification_token(email_verification_token, &conn),
                "Failed to create email_verification_token",
            )?;

            // send email
            let to_name = &user.name.unwrap_or("Anonymous".to_owned());
            let (subject, body) = mail_builder::email_verification_at_create(to_name, &token)?;
            common::send_mail(&user.email, to_name, &subject, body).map_err(|e| {
                let m = "Failed to send email verification email.";
                GraphqlError::ServerError(m.into(), e.message).extend()
            })?;

            Ok(())
        })?;

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn edit_profile(&self, ctx: &Context<'_>, input: EditProfileInput) -> Result<User> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        validator::code_validator("code", &input.code, Some(identity.id), &conn)?;
        validator::max_length_validator(
            "comment",
            &input.comment.as_deref().unwrap_or(""),
            USER_COMMENT_MAX_LEN,
        )?;

        let change_user = ChangeUserEntity {
            id: identity.id,
            code: Some(input.code),
            name: Some(Some(input.name)),
            comment: Some(input.comment),
            avatar: None,
            updated_at: Some(Local::now().naive_local()),
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
    async fn change_email(&self, ctx: &Context<'_>, email: String) -> Result<bool> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let user = common::convert_query_result(
            service::find_user_by_id(identity.id, &conn),
            "Failed to get the user",
        )?;

        if user.email == email {
            let e = GraphqlError::ValidationError(error::V_EMAIL_NO_CHANGE.into(), "email");
            return Err(e.extend());
        }

        validator::email_validator("email", &email, &conn)?;

        let (token_digest, token) = security::create_verification_token(
            identity.id,
            &email_verification::DIGEST_SECRET_KEY,
            &email_verification::CIPHER_PASSWORD,
        )?;

        let email_verification_token = NewEmailVerificationTokenEntity {
            user_id: user.id,
            category: email_verification_token_const::category::UPDATE,
            email: email.clone(),
            token: token_digest,
            created_at: Local::now().naive_local(),
        };

        common::convert_query_result(
            service::upsert_email_verification_token(email_verification_token, &conn),
            "Failed to crate email_verification_token",
        )?;

        // send email
        let to_name = &user.name.unwrap_or("Anonymous".to_owned());
        let (subject, body) = mail_builder::email_verification_at_update(to_name, &token)?;
        common::send_mail(&email, to_name, &subject, body).map_err(|e| {
            let m = "Failed to send email verification email.";
            GraphqlError::ServerError(m.into(), e.message).extend()
        })?;

        Ok(true)
    }

    async fn verify_email(&self, ctx: &Context<'_>, token: Option<String>) -> Result<bool> {
        let conn = common::get_conn(ctx)?;

        let token = token.ok_or_else(|| {
            GraphqlError::ValidationError(error::V_TOKEN_NOT_ENTERED.into(), "token").extend()
        })?;

        let cipher_pass = &email_verification::CIPHER_PASSWORD;
        let claims = security::decrypt_verification_token(&token, cipher_pass).map_err(|_| {
            GraphqlError::ValidationError(error::V_TOKEN_INVALID.into(), "token").extend()
        })?;

        let user = common::convert_query_result(
            service::find_user_including_unverified(claims.user_id, &conn),
            "Failed to get the user with token",
        )?;

        let token_record = common::convert_query_result(
            service::find_email_verification_token_by_user_id(user.id, &conn),
            "Failed to get email_verification_token",
        )?;

        let now = Local::now().naive_local();
        let duration = now - token_record.created_at;
        if *email_verification::LINK_MAX_MINUTES < duration.num_minutes() {
            let e = GraphqlError::ValidationError(error::V_TOKEN_EXPIRED.into(), "token");
            return Err(e.extend());
        }

        let token_digest = token_record.token;
        let digest_secret = &email_verification::DIGEST_SECRET_KEY;
        let matching = hash::verify(&token_digest, &claims.token, digest_secret);
        if !matching.unwrap_or(false) {
            let e = GraphqlError::ValidationError(error::V_TOKEN_NOT_MATCH.into(), "token");
            return Err(e.extend());
        }

        let change_user = ChangeUserEntity {
            id: user.id,
            email: Some(token_record.email),
            status: Some(user_const::status::ACTIVE),
            updated_at: Some(Local::now().naive_local()),
            ..Default::default()
        };

        conn.transaction::<_, Error, _>(|| {
            common::convert_query_result(
                service::update_user(change_user, &conn),
                "Failed to update user",
            )?;

            common::convert_query_result(
                service::delete_email_verification_token(user.id, &conn),
                "Failed to delete email_verification_token",
            )?;

            Ok(())
        })?;

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn change_password(&self, ctx: &Context<'_>, input: ChangePasswordInput) -> Result<bool> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let user = common::convert_query_result(
            service::find_user_by_id(identity.id, &conn),
            "Failed to get the user",
        )?;

        let matching = security::password_verify(&user.password, &input.password);
        if !matching.unwrap_or(false) {
            let e = GraphqlError::ValidationError(error::V_PASS_INCORRECT.into(), "password");
            return Err(e.extend());
        }

        validator::password_validator(
            "newPassword",
            "newPasswordConfirm",
            &input.new_password,
            &input.new_password_confirm,
        )?;

        let password = security::password_hash(input.password.as_str()).map_err(|e| {
            let m = "Failed to create password hash.";
            GraphqlError::ServerError(m.into(), e.to_string()).extend()
        })?;

        let change_user = ChangeUserEntity {
            id: identity.id,
            password: Some(password),
            updated_at: Some(Local::now().naive_local()),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_user(change_user, &conn),
            "Failed to update user",
        )?;

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::Guest)")]
    async fn forgot_password(&self, ctx: &Context<'_>, email: String) -> Result<bool> {
        let conn = common::get_conn(ctx)?;

        if !is_valid_email(&email) {
            let e = GraphqlError::ValidationError(error::V_EMAIL_FORMAT.into(), "email");
            return Err(e.extend());
        }

        let user = service::find_user_by_email(&email, &conn);
        if let Ok(user) = user {
            let (token_digest, token) = security::create_verification_token(
                user.id,
                &password_reset::DIGEST_SECRET_KEY,
                &password_reset::CIPHER_PASSWORD,
            )?;

            let password_reset_token = NewPasswordResetTokenEntity {
                user_id: user.id,
                token: token_digest,
                created_at: Local::now().naive_local(),
            };

            common::convert_query_result(
                service::upsert_password_reset_token(password_reset_token, &conn),
                "Failed to crate password_reset_token",
            )?;

            // send email
            let to_name = &user.name.unwrap_or("Anonymous".to_owned());
            let (subject, body) = mail_builder::forgot_password(&token)?;
            common::send_mail(&user.email, to_name, &subject, body).map_err(|e| {
                let m = "Failed to send password reset email.";
                GraphqlError::ServerError(m.into(), e.message).extend()
            })?;
        }

        Ok(true)
    }

    async fn reset_password(&self, ctx: &Context<'_>, input: ResetPasswordInput) -> Result<bool> {
        let conn = common::get_conn(ctx)?;
        let user = common::get_user_by_password_reset_token(&input.token, ctx)?;

        validator::password_validator(
            "password",
            "passwordConfirm",
            &input.password,
            &input.password_confirm,
        )?;

        let password = security::password_hash(input.password.as_str()).map_err(|e| {
            let m = "Failed to create password hash.";
            GraphqlError::ServerError(m.into(), e.to_string()).extend()
        })?;

        let change_user = ChangeUserEntity {
            id: user.id,
            password: Some(password),
            updated_at: Some(Local::now().naive_local()),
            ..Default::default()
        };

        conn.transaction::<_, Error, _>(|| {
            common::convert_query_result(
                service::update_user(change_user, &conn),
                "Failed to update user",
            )?;

            common::convert_query_result(
                service::delete_password_reset_token(user.id, &conn),
                "Failed to delete password_reset_token",
            )?;

            Ok(())
        })?;

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn delete_account(&self, ctx: &Context<'_>) -> Result<bool> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let change_user = ChangeUserEntity {
            id: identity.id,
            status: Some(user_const::status::DELETED),
            updated_at: Some(Local::now().naive_local()),
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
        let identity = auth::get_identity(ctx)?;

        let contact = service::find_contact_by_id(common::convert_id(&input.contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId");
            return Err(e.extend());
        }

        if contact.blocked {
            let e = GraphqlError::ValidationError(error::V_CONTACT_BLOCKED.into(), "contactId");
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
    async fn send_image(&self, ctx: &Context<'_>, input: SendImageInput) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let contact = service::find_contact_by_id(common::convert_id(&input.contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId");
            return Err(e.extend());
        }

        if contact.blocked {
            let e = GraphqlError::ValidationError(error::V_CONTACT_BLOCKED.into(), "contactId");
            return Err(e.extend());
        }

        let message_changed = create_message(
            contact.contact_user_id,
            message_const::category::IMAGE_TRANSMISSION,
            Some("image URL".into()),
            Some(contact.id),
            Some(contact.status),
            ctx,
        )?;

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn call_offer(&self, ctx: &Context<'_>, input: CallOfferInput) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let contact = service::find_contact_by_id(common::convert_id(&input.contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId");
            return Err(e.extend());
        }

        if contact.blocked {
            let e = GraphqlError::ValidationError(error::V_CONTACT_BLOCKED.into(), "contactId");
            return Err(e.extend());
        }

        let now = Local::now().naive_local();
        let new_message = NewMessageEntity {
            tx_user_id: identity.id,
            rx_user_id: contact.contact_user_id,
            category: message_const::category::CALLING,
            message: None,
            status: message_const::status::UNREAD,
            created_at: now,
            updated_at: now,
        };

        let message = common::convert_query_result(
            service::create_message(new_message, &conn),
            "Failed to create message",
        )?;

        let new_call = NewCallEntity {
            message_id: message.id,
            status: call_const::status::OFFER,
            created_at: now,
            updated_at: now,
        };

        let call = common::convert_query_result(
            service::create_call(new_call, &conn),
            "Failed to create call",
        )?;

        let call_event = CallEvent {
            call_id: call.id,
            tx_user_id: message.tx_user_id,
            rx_user_id: message.rx_user_id,
            data: input.data,
            event_type: CallEventType::Offer,
        };

        let message = Message::from(&(message, Some(call)));
        let message_changed = MessageChanged {
            tx_user_id: message.tx_user_id,
            rx_user_id: message.rx_user_id,
            contact_id: Some(contact.id),
            contact_status: Some(contact.status),
            message: Some(message),
            messages: None,
            mutation_type: MutationType::Created,
        };

        let rx_user_contact = service::find_contact_with_user(
            message_changed.rx_user_id,
            message_changed.tx_user_id,
            &conn,
        );

        if let Some(rx_user_contact) = rx_user_contact.ok() {
            if !(rx_user_contact.0.blocked) {
                publish_call_event(&call_event);
                publish_message(&message_changed);
            }
        }

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn delete_message(&self, ctx: &Context<'_>, message_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let message = service::find_message_by_id(common::convert_id(&message_id)?, &conn);
        let (message, _) = message.map_err(|_| {
            GraphqlError::ValidationError(error::V_MESSAGE_ID_INVALID.into(), "messageId").extend()
        })?;

        if message.tx_user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_MESSAGE_ID_INVALID.into(), "messageId");
            return Err(e.extend());
        }

        if message_const::status::DELETED == message.status {
            let e = GraphqlError::ValidationError(error::V_MESSAGE_DELETED.into(), "contactId");
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
            updated_at: Some(Local::now().naive_local()),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_message(change_message, &conn),
            "Failed to update message",
        )?;

        let (message, call) = common::convert_query_result(
            service::find_message_by_id(message.id, &conn),
            "Failed to get message",
        )?;

        let message_changed = MessageChanged {
            tx_user_id: message.tx_user_id,
            rx_user_id: message.rx_user_id,
            contact_id,
            contact_status,
            message: Some(Message::from(&(message, call))),
            messages: None,
            mutation_type: MutationType::Deleted,
        };

        let rx_user_contact = service::find_contact_with_user(
            message_changed.tx_user_id,
            message_changed.rx_user_id,
            &conn,
        );

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
        let identity = auth::get_identity(ctx)?;

        let other_user_id = common::convert_id(&other_user_id)?;

        let mut contact_id = None;
        let mut contact_status = None;

        let contact = service::find_contact_with_user(identity.id, other_user_id, &conn);
        if let Ok((contact, _)) = contact {
            if contact.blocked {
                let m = error::V_CONTACT_BLOCKED;
                let e = GraphqlError::ValidationError(m.into(), "otherUserId");
                return Err(e.extend());
            }

            contact_id = Some(contact.id);
            contact_status = Some(contact.status);
        }

        let mut targets = common::convert_query_result(
            service::get_unread_messages(identity.id, other_user_id, &conn),
            "Failed to get messages",
        )?;

        common::convert_query_result(
            service::update_message_to_read(identity.id, other_user_id, &conn),
            "Failed to update messages",
        )?;

        targets
            .iter_mut()
            .for_each(|(message, _)| message.status = message_const::status::READ);

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

        let contact_user_contact = service::find_contact_with_user(
            message_changed.rx_user_id,
            message_changed.tx_user_id,
            &conn,
        );

        if let Some(contact_user_contact) = contact_user_contact.ok() {
            if !(contact_user_contact.0.blocked) {
                publish_message(&message_changed)
            }
        }

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn apply_contact(&self, ctx: &Context<'_>, other_user_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let other_user_id = common::convert_id(&other_user_id)?;

        let contact = service::find_contact_with_user(identity.id, other_user_id, &conn);
        if contact.is_ok() {
            let m = error::V_CONTACT_REGISTERED;
            let e = GraphqlError::ValidationError(m.into(), "otherUserId");
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
    async fn approve_contact(&self, ctx: &Context<'_>, message_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let message = service::find_message_by_id(common::convert_id(&message_id)?, &conn);
        let (message, _) = message.map_err(|_| {
            let e = GraphqlError::ValidationError(error::V_MESSAGE_ID_INVALID.into(), "messageId");
            e.extend()
        })?;

        if message_const::category::CONTACT_APPLICATION != message.category {
            let m = error::V_MESSAGE_NOT_APPLICATION;
            let e = GraphqlError::ValidationError(m.into(), "messageId");
            return Err(e.extend());
        }

        if message.rx_user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_MESSAGE_ID_INVALID.into(), "messageId");
            return Err(e.extend());
        }

        let contact = service::find_contact_with_user(identity.id, message.tx_user_id, &conn);
        if contact.is_ok() {
            let e = GraphqlError::ValidationError(error::V_CONTACT_REGISTERED.into(), "messageId");
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
        let identity = auth::get_identity(ctx)?;

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId");
            return Err(e.extend());
        }

        if contact_const::status::DELETED == contact.status {
            let e = GraphqlError::ValidationError(error::V_CONTACT_DELETED.into(), "contactId");
            return Err(e.extend());
        }

        let change_contact = ChangeContactEntity {
            id: contact.id,
            status: Some(contact_const::status::DELETED),
            updated_at: Some(Local::now().naive_local()),
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
        let identity = auth::get_identity(ctx)?;

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId");
            return Err(e.extend());
        }

        if contact_const::status::DELETED != contact.status {
            let m = error::V_CONTACT_NOT_DELETED;
            let e = GraphqlError::ValidationError(m.into(), "contactId");
            return Err(e.extend());
        }

        let change_contact = ChangeContactEntity {
            id: contact.id,
            status: Some(contact_const::status::APPROVED),
            updated_at: Some(Local::now().naive_local()),
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
        let identity = auth::get_identity(ctx)?;

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId");
            return Err(e.extend());
        }

        if contact.blocked {
            let e = GraphqlError::ValidationError(error::V_CONTACT_BLOCKED.into(), "contactId");
            return Err(e.extend());
        }

        let change_contact = ChangeContactEntity {
            id: contact.id,
            blocked: Some(true),
            updated_at: Some(Local::now().naive_local()),
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
        let identity = auth::get_identity(ctx)?;

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId").extend()
        })?;

        if contact.user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId");
            return Err(e.extend());
        }

        if !contact.blocked {
            let m = error::V_CONTACT_NOT_BLOCKED;
            let e = GraphqlError::ValidationError(m.into(), "contactId");
            return Err(e.extend());
        }

        let change_contact = ChangeContactEntity {
            id: contact.id,
            blocked: Some(false),
            updated_at: Some(Local::now().naive_local()),
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

    let now = Local::now().naive_local();
    let new_contact = NewContactEntity {
        user_id: user_id,
        contact_user_id: contact_user_id,
        status: contact_const::status::APPROVED,
        blocked: false,
        created_at: now,
        updated_at: now,
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

    let now = Local::now().naive_local();
    let new_message = NewMessageEntity {
        tx_user_id: identity.id,
        rx_user_id,
        category,
        message,
        status: message_const::status::UNREAD,
        created_at: now,
        updated_at: now,
    };

    let message = common::convert_query_result(
        service::create_message(new_message, &conn),
        "Failed to create message",
    )?;

    let message = Message::from(&(message, None));
    let message_changed = MessageChanged {
        tx_user_id: message.tx_user_id,
        rx_user_id: message.rx_user_id,
        contact_id,
        contact_status,
        message: Some(message),
        messages: None,
        mutation_type: MutationType::Created,
    };

    let rx_user_contact = service::find_contact_with_user(
        message_changed.rx_user_id,
        message_changed.tx_user_id,
        &conn,
    );

    if let Some(rx_user_contact) = rx_user_contact.ok() {
        if !(rx_user_contact.0.blocked) {
            publish_message(&message_changed);
        }
    }

    Ok(message_changed)
}

fn publish_message(message_changed: &MessageChanged) {
    SimpleBroker::publish(message_changed.clone());
}

fn publish_call_event(call_event: &CallEvent) {
    SimpleBroker::publish(call_event.clone());
}
