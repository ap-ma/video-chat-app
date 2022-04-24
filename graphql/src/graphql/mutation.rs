use super::common::{self, MutationType, SimpleBroker};
use super::form::{
    ChangePasswordInput, EditProfileInput, SendMessageInput, SignInInput, SignUpInput,
};
use super::model::{Contact, Message, MessageChanged, User};
use super::security::auth::{self, Role};
use super::security::{password, random, validator, RoleGuard};
use super::GraphqlError;
use crate::constants::{contact as contact_const, message as message_const, user as user_const};
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
        if let Some(user) = service::find_user_by_email(&input.email, None, &conn).ok() {
            if let Ok(matching) = password::verify(&user.password, &input.password, &user.secret) {
                if matching {
                    auth::sign_in(&user, ctx)?;
                    return Ok(true);
                }
            }
        }
        return Err(GraphqlError::ValidationError(
            "Incorrect Email address or Password.".into(),
            "email, password",
        )
        .extend());
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
        validator::password_validator(
            "password",
            "password_confirm",
            &input.password,
            &input.password_confirm,
        )?;
        if let Some(comment) = &input.comment {
            // 平均4バイト想定 50文字前後
            validator::max_length_validator("comment", comment, 200)?;
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

        auth::sign_in(&user, ctx)?;

        Ok(true)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn edit_profile(&self, ctx: &Context<'_>, input: EditProfileInput) -> Result<User> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        validator::code_validator("code", &input.code, Some(identity.id), &conn)?;
        validator::email_validator("email", &input.email, Some(identity.id), &conn)?;
        if let Some(comment) = &input.comment {
            // 平均4バイト想定 50文字前後
            validator::max_length_validator("comment", comment, 200)?;
        }

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

        let matching = password::verify(&user.password, &input.password, &user.secret);
        if !matching.unwrap_or(false) {
            return Err(
                GraphqlError::ValidationError("Password is incorrect.".into(), "password").extend(),
            );
        }

        validator::password_validator(
            "new_password",
            "new_password_confirm",
            &input.new_password,
            &input.new_password_confirm,
        )?;

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
        let change_user = ChangeUserEntity {
            id: identity.id,
            password: Some(password),
            secret: Some(secret),
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
                return Err(GraphqlError::ServerError(
                    "The process was terminated due to an unexpected error.".into(),
                    format!("Database status is invalid. There were {} updates.", count),
                )
                .extend());
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

        let contact =
            service::find_contact_by_id(common::convert_id(&input.contact_id)?, &conn).ok();
        if let None = contact {
            return Err(GraphqlError::ValidationError(
                "Unable to get contact.".into(),
                "contact_id",
            )
            .extend());
        }

        let contact = contact.unwrap();
        if contact.user_id != identity.id {
            return Err(
                GraphqlError::ValidationError("Invalid contact id".into(), "contact_id").extend(),
            );
        }
        if contact.status == contact_const::status::DELETED {
            return Err(GraphqlError::ValidationError(
                "Contact has been deleted.".into(),
                "contact_id",
            )
            .extend());
        }
        if contact.blocked {
            return Err(
                GraphqlError::ValidationError("Cntact is blocked".into(), "contact_id").extend(),
            );
        }

        let message_changed = create_message(
            contact.contact_user_id,
            message_const::category::MESSAGE,
            Some(input.message),
            ctx,
        )?;

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn delete_message(&self, ctx: &Context<'_>, message_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let message = service::find_message_by_id(common::convert_id(&message_id)?, &conn).ok();
        if let None = message {
            return Err(GraphqlError::ValidationError(
                "Unable to get message".into(),
                "message_id",
            )
            .extend());
        }

        let message = message.unwrap();
        if message.tx_user_id != identity.id {
            return Err(
                GraphqlError::ValidationError("Invalid message id".into(), "message_id").extend(),
            );
        }
        if message.status == message_const::status::DELETED {
            return Err(GraphqlError::ValidationError(
                "Message has already been deleted".into(),
                "contact_id",
            )
            .extend());
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
    async fn read_messages(&self, ctx: &Context<'_>, contact_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn).ok();
        if let None = contact {
            return Err(GraphqlError::ValidationError(
                "Unable to get contact.".into(),
                "contact_id",
            )
            .extend());
        }

        let contact = contact.unwrap();
        if contact.user_id != identity.id {
            return Err(
                GraphqlError::ValidationError("Invalid contact id".into(), "contact_id").extend(),
            );
        }
        if contact.status == contact_const::status::DELETED {
            return Err(GraphqlError::ValidationError(
                "Contact has been deleted.".into(),
                "contact_id",
            )
            .extend());
        }
        if contact.blocked {
            return Err(
                GraphqlError::ValidationError("Cntact is blocked".into(), "contact_id").extend(),
            );
        }

        let targets = common::convert_query_result(
            service::get_unread_messages(contact.user_id, contact.contact_user_id, &conn),
            "Failed to get messages",
        )?;

        common::convert_query_result(
            service::update_message_to_read(contact.user_id, contact.contact_user_id, &conn),
            "Failed to update messages",
        )?;

        let messages = targets.iter().map(Message::from).collect();
        let message_changed = MessageChanged {
            tx_user_id: contact.user_id,
            rx_user_id: contact.contact_user_id,
            message: None,
            messages: Some(messages),
            mutation_type: MutationType::Updated,
        };

        let contact_user_contact =
            service::find_contact_with_user(contact.contact_user_id, contact.user_id, &conn);

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
        if let Some(_) = service::find_contact_with_user(identity.id, other_user_id, &conn).ok() {
            return Err(GraphqlError::ValidationError(
                "Contact is already registered".into(),
                "other_user_id",
            )
            .extend());
        }

        let message_changed = create_message(
            other_user_id,
            message_const::category::CONTACT_APPLICATION,
            None,
            ctx,
        )?;

        Ok(message_changed)
    }

    #[graphql(guard = "RoleGuard::new(Role::User)")]
    async fn contact_approval(&self, ctx: &Context<'_>, message_id: ID) -> Result<MessageChanged> {
        let conn = common::get_conn(ctx)?;
        let identity = auth::get_identity(ctx)?.unwrap();

        let message = service::find_message_by_id(common::convert_id(&message_id)?, &conn).ok();
        if let None = message {
            return Err(GraphqlError::ValidationError(
                "Unable to get contact application message".into(),
                "message_id",
            )
            .extend());
        }

        let message = message.unwrap();
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

        let message_changed = conn.transaction::<_, Error, _>(|| {
            create_contact(identity.id, message.rx_user_id, ctx)?;
            create_contact(message.rx_user_id, identity.id, ctx)?;
            let message_changed = create_message(
                message.rx_user_id,
                message_const::category::CONTACT_APPROVAL,
                None,
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

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn).ok();
        if let None = contact {
            return Err(GraphqlError::ValidationError(
                "Unable to get contact".into(),
                "contact_id",
            )
            .extend());
        }

        let contact = contact.unwrap();
        if contact.user_id != identity.id {
            return Err(
                GraphqlError::ValidationError("Invalid contact id".into(), "contact_id").extend(),
            );
        }
        if contact.status == contact_const::status::DELETED {
            return Err(GraphqlError::ValidationError(
                "Contact has already been deleted".into(),
                "contact_id",
            )
            .extend());
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

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn).ok();
        if let None = contact {
            return Err(GraphqlError::ValidationError(
                "Unable to get contact".into(),
                "contact_id",
            )
            .extend());
        }

        let contact = contact.unwrap();
        if contact.user_id != identity.id {
            return Err(
                GraphqlError::ValidationError("Invalid contact id".into(), "contact_id").extend(),
            );
        }
        if contact.status != contact_const::status::DELETED {
            return Err(GraphqlError::ValidationError(
                "Contacts have not been deleted".into(),
                "contact_id",
            )
            .extend());
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

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn).ok();
        if let None = contact {
            return Err(GraphqlError::ValidationError(
                "Unable to get contact".into(),
                "contact_id",
            )
            .extend());
        }

        let contact = contact.unwrap();
        if contact.user_id != identity.id {
            return Err(
                GraphqlError::ValidationError("Invalid contact id".into(), "contact_id").extend(),
            );
        }
        if contact.blocked {
            return Err(GraphqlError::ValidationError(
                "Contact has already been blocked".into(),
                "contact_id",
            )
            .extend());
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

        let contact = service::find_contact_by_id(common::convert_id(&contact_id)?, &conn).ok();
        if let None = contact {
            return Err(GraphqlError::ValidationError(
                "Unable to get contact".into(),
                "contact_id",
            )
            .extend());
        }

        let contact = contact.unwrap();
        if contact.user_id != identity.id {
            return Err(
                GraphqlError::ValidationError("Invalid contact id".into(), "contact_id").extend(),
            );
        }
        if !contact.blocked {
            return Err(GraphqlError::ValidationError(
                "Contact is not blocked".into(),
                "contact_id",
            )
            .extend());
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
    ctx: &Context<'_>,
) -> Result<MessageChanged> {
    let conn = common::get_conn(ctx)?;
    let identity = auth::get_identity(ctx)?;

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

    let message_changed = MessageChanged {
        tx_user_id: message.tx_user_id,
        rx_user_id: message.rx_user_id,
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
