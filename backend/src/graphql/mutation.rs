use super::common::{self, mail_builder, MutationType, SignalType, SimpleBroker};
use super::form::{
    ChangePasswordInput, EditProfileInput, PickUpInput, ResetPasswordInput, RingUpInput,
    SendIceCandidateInput, SendImageInput, SendMessageInput, SignInInput, SignUpInput,
};
use super::model::{Contact, IceCandidate, Message, MessageChanged, Signal, User};
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
    ChangeCallEntity, ChangeContactEntity, ChangeMessageEntity, ChangeUserEntity, ContactEntity,
    NewCallEntity, NewContactEntity, NewEmailVerificationTokenEntity, NewMessageEntity,
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

        let mut avatar_file = None;
        let mut avatar_filename = None;

        if let Some(avatar) = input.avatar {
            let avatar = common::get_upload_file_info(avatar, ctx).map_err(|e| {
                let m = "Failed to get file info.";
                GraphqlError::ServerError(m.into(), e.message).extend()
            })?;

            avatar_filename = Some(avatar.1.clone());
            avatar_file = Some(avatar);
        }

        let now = Local::now().naive_local();
        let new_user = NewUserEntity {
            code: input.code,
            name: Some(input.name),
            email: input.email,
            password,
            comment: input.comment,
            avatar: avatar_filename,
            role: user_const::role::USER,
            status: user_const::status::UNVERIFIED,
            created_at: now,
            updated_at: now,
        };

        let user_id = conn.transaction::<_, Error, _>(|| {
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

            Ok(user.id)
        })?;

        if let Some((data, filename, content_type)) = avatar_file {
            let path = common::get_avatar_file_path(&filename, user_id);
            let upload_result = common::file_upload(data, &path, &content_type).await;
            upload_result.map_err(|e| {
                GraphqlError::ServerError("Failed to file upload.".into(), e.message).extend()
            })?;
        };

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

        let mut avatar_file = None;
        let mut avatar_filename = None;

        if let Some(avatar) = input.avatar {
            let avatar = common::get_upload_file_info(avatar, ctx).map_err(|e| {
                let m = "Failed to get file info.";
                GraphqlError::ServerError(m.into(), e.message).extend()
            })?;

            avatar_filename = Some(avatar.1.clone());
            avatar_file = Some(avatar);
        }

        let change_user = ChangeUserEntity {
            id: identity.id,
            code: Some(input.code),
            name: Some(Some(input.name)),
            comment: Some(input.comment),
            avatar: Some(avatar_filename),
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

        if let Some((data, filename, content_type)) = avatar_file {
            let path = common::get_avatar_file_path(&filename, user.id);
            let upload_result = common::file_upload(data, &path, &content_type).await;
            upload_result.map_err(|e| {
                GraphqlError::ServerError("Failed to file upload.".into(), e.message).extend()
            })?;
        };

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

        let image_file = common::get_upload_file_info(input.image, ctx).map_err(|e| {
            let m = "Failed to get file info.";
            GraphqlError::ServerError(m.into(), e.message).extend()
        })?;

        let (data, filename, content_type) = image_file;
        let path = common::get_image_file_path(&filename, identity.id, contact.contact_user_id);
        let upload_result = common::file_upload(data, &path, &content_type).await;
        upload_result.map_err(|e| {
            GraphqlError::ServerError("Failed to file upload.".into(), e.message).extend()
        })?;

        let message_changed = create_message(
            contact.contact_user_id,
            message_const::category::IMAGE_TRANSMISSION,
            Some(filename),
            Some(contact.id),
            Some(contact.status),
            ctx,
        )?;

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn ring_up(&self, ctx: &Context<'_>, input: RingUpInput) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let user = common::convert_query_result(
            service::find_user_by_id(identity.id, &conn),
            "Failed to get the user",
        )?;

        let contact = service::find_contact_by_id(common::convert_id(&input.contact_id)?, &conn);
        let contact = contact.map_err(|_| {
            GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId").extend()
        })?;

        if contact.user_id != user.id {
            let e = GraphqlError::ValidationError(error::V_CONTACT_ID_INVALID.into(), "contactId");
            return Err(e.extend());
        }

        if contact.blocked {
            let e = GraphqlError::ValidationError(error::V_CONTACT_BLOCKED.into(), "contactId");
            return Err(e.extend());
        }

        let now = Local::now().naive_local();
        let new_message = NewMessageEntity {
            tx_user_id: user.id,
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

        let signal = Signal {
            call_id: call.id,
            tx_user_id: message.tx_user_id,
            tx_user_name: user.name,
            tx_user_avatar: user.avatar,
            rx_user_id: message.rx_user_id,
            sdp: Some(input.sdp),
            signal_type: SignalType::Offer,
        };

        let message = Message::from(&(message, Some(call)));
        let message_changed = MessageChanged {
            tx_user_id: signal.tx_user_id,
            rx_user_id: signal.rx_user_id,
            contact_id: Some(contact.id),
            contact_status: Some(contact.status),
            message: Some(message),
            messages: None,
            mutation_type: MutationType::Created,
        };

        let rx_user_contact = service::find_contact_by_user_id(
            message_changed.rx_user_id,
            message_changed.tx_user_id,
            &conn,
        );

        if let Some(rx_user_contact) = rx_user_contact.ok() {
            if !(rx_user_contact.0.blocked) {
                publish_signal(&signal);
                publish_message(&message_changed);
            }
        }

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn pick_up(&self, ctx: &Context<'_>, input: PickUpInput) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let call = service::find_call_by_id(common::convert_id(&input.call_id)?, &conn);
        let (call, message) = call.map_err(|_| {
            GraphqlError::ValidationError(error::V_CALL_ID_INVALID.into(), "callId").extend()
        })?;

        if message.rx_user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_CALL_ID_INVALID.into(), "callId");
            return Err(e.extend());
        }

        if call_const::status::OFFER != call.status {
            let e = GraphqlError::ValidationError(error::V_CALL_NOT_OFFER.into(), "callId");
            return Err(e.extend());
        }

        let now = Local::now().naive_local();
        let change_call = ChangeCallEntity {
            id: call.id,
            status: Some(call_const::status::BUSY),
            started_at: Some(Some(now)),
            updated_at: Some(now),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_call(change_call, &conn),
            "Failed to update call",
        )?;

        let signal = Signal {
            call_id: call.id,
            tx_user_id: identity.id,
            tx_user_name: None,
            tx_user_avatar: None,
            rx_user_id: message.tx_user_id,
            sdp: Some(input.sdp),
            signal_type: SignalType::Answer,
        };

        let (message, call) = common::convert_query_result(
            service::find_message_by_id(message.id, &conn),
            "Failed to get message",
        )?;

        let message = Message::from(&(message, call));
        let message_changed = MessageChanged {
            tx_user_id: signal.tx_user_id,
            rx_user_id: signal.rx_user_id,
            contact_id: None,
            contact_status: None,
            message: Some(message),
            messages: None,
            mutation_type: MutationType::Updated,
        };

        publish_signal(&signal);
        publish_message(&message_changed);

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn hang_up(&self, ctx: &Context<'_>, call_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let call = service::find_call_by_id(common::convert_id(&call_id)?, &conn);
        let (call, message) = call.map_err(|_| {
            GraphqlError::ValidationError(error::V_CALL_ID_INVALID.into(), "callId").extend()
        })?;

        if message.tx_user_id != identity.id && message.rx_user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_CALL_ID_INVALID.into(), "callId");
            return Err(e.extend());
        }

        if call_const::status::BUSY != call.status {
            let e = GraphqlError::ValidationError(error::V_CALL_NOT_BUSY.into(), "callId");
            return Err(e.extend());
        }

        let now = Local::now().naive_local();
        let change_call = ChangeCallEntity {
            id: call.id,
            status: Some(call_const::status::ENDED),
            ended_at: Some(Some(now)),
            updated_at: Some(now),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_call(change_call, &conn),
            "Failed to update call",
        )?;

        let other_user_id = if message.tx_user_id == identity.id {
            message.rx_user_id
        } else {
            message.tx_user_id
        };

        let signal = Signal {
            call_id: call.id,
            tx_user_id: identity.id,
            tx_user_name: None,
            tx_user_avatar: None,
            rx_user_id: other_user_id,
            sdp: None,
            signal_type: SignalType::Close,
        };

        let (message, call) = common::convert_query_result(
            service::find_message_by_id(message.id, &conn),
            "Failed to get message",
        )?;

        let message = Message::from(&(message, call));
        let message_changed = MessageChanged {
            tx_user_id: signal.tx_user_id,
            rx_user_id: signal.rx_user_id,
            contact_id: None,
            contact_status: None,
            message: Some(message),
            messages: None,
            mutation_type: MutationType::Updated,
        };

        publish_signal(&signal);
        publish_message(&message_changed);

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn cancel(&self, ctx: &Context<'_>, call_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?;

        let call = service::find_call_by_id(common::convert_id(&call_id)?, &conn);
        let (call, message) = call.map_err(|_| {
            GraphqlError::ValidationError(error::V_CALL_ID_INVALID.into(), "callId").extend()
        })?;

        if message.tx_user_id != identity.id && message.rx_user_id != identity.id {
            let e = GraphqlError::ValidationError(error::V_CALL_ID_INVALID.into(), "callId");
            return Err(e.extend());
        }

        if call_const::status::OFFER != call.status {
            let e = GraphqlError::ValidationError(error::V_CALL_NOT_OFFER.into(), "callId");
            return Err(e.extend());
        }

        let now = Local::now().naive_local();
        let change_call = ChangeCallEntity {
            id: call.id,
            status: Some(call_const::status::CANCELED),
            updated_at: Some(now),
            ..Default::default()
        };

        common::convert_query_result(
            service::update_call(change_call, &conn),
            "Failed to update call",
        )?;

        let other_user_id = if message.tx_user_id == identity.id {
            message.rx_user_id
        } else {
            message.tx_user_id
        };

        let signal = Signal {
            call_id: call.id,
            tx_user_id: identity.id,
            tx_user_name: None,
            tx_user_avatar: None,
            rx_user_id: other_user_id,
            sdp: None,
            signal_type: SignalType::Cancel,
        };

        let (message, call) = common::convert_query_result(
            service::find_message_by_id(message.id, &conn),
            "Failed to get message",
        )?;

        let message = Message::from(&(message, call));
        let message_changed = MessageChanged {
            tx_user_id: signal.tx_user_id,
            rx_user_id: signal.rx_user_id,
            contact_id: None,
            contact_status: None,
            message: Some(message),
            messages: None,
            mutation_type: MutationType::Updated,
        };

        publish_signal(&signal);
        publish_message(&message_changed);

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn send_ice_candidate(
        &self,
        ctx: &Context<'_>,
        input: SendIceCandidateInput,
    ) -> Result<bool> {
        let identity = auth::get_identity(ctx)?;
        let candidate = IceCandidate {
            call_id: common::convert_id(&input.call_id)?,
            tx_user_id: identity.id,
            rx_user_id: common::convert_id(&input.other_user_id)?,
            candidate: input.candidate,
        };

        publish_candidate(&candidate);

        Ok(true)
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

        let contact = service::find_contact_by_user_id(identity.id, message.rx_user_id, &conn);
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

        let message = Message::from(&(message, call));
        let message_changed = MessageChanged {
            tx_user_id: message.tx_user_id,
            rx_user_id: message.rx_user_id,
            contact_id,
            contact_status,
            message: Some(message),
            messages: None,
            mutation_type: MutationType::Deleted,
        };

        let rx_user_contact = service::find_contact_by_user_id(
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

        let contact = service::find_contact_by_user_id(identity.id, other_user_id, &conn);
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

        let contact_user_contact = service::find_contact_by_user_id(
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

        let contact = service::find_contact_by_user_id(identity.id, other_user_id, &conn);
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

        publish_message(&message_changed);

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

        let contact = service::find_contact_by_user_id(identity.id, message.tx_user_id, &conn);
        if contact.is_ok() {
            let e = GraphqlError::ValidationError(error::V_CONTACT_REGISTERED.into(), "messageId");
            return Err(e.extend());
        }

        let message_changed = conn.transaction::<_, Error, _>(|| {
            let contact = create_contact(identity.id, message.tx_user_id, ctx)?;
            create_contact(contact.contact_user_id, contact.user_id, ctx)?;
            let message_changed = create_message(
                contact.contact_user_id,
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
            service::find_contact_by_user_id(identity.id, contact.contact_user_id, &conn),
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
            service::find_contact_by_user_id(identity.id, contact.contact_user_id, &conn),
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
            service::find_contact_by_user_id(identity.id, contact.contact_user_id, &conn),
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
            service::find_contact_by_user_id(identity.id, contact.contact_user_id, &conn),
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

    let rx_user_contact = service::find_contact_by_user_id(
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

fn publish_signal(signal: &Signal) {
    SimpleBroker::publish(signal.clone());
}

fn publish_candidate(signal: &IceCandidate) {
    SimpleBroker::publish(signal.clone());
}
