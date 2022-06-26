import { Contact, Message } from 'graphql/generated'

//  ----------------------------------------------------------------------------
//  Local state types
//  ----------------------------------------------------------------------------

/** Local State ContactInfoUserId */
export type ContactInfoUserId = Contact['userId'] | undefined

/** Local State DeleteMessageId */
export type DeleteMessageId = Message['id'] | undefined
