import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String'];
  newPasswordConfirm: Scalars['String'];
  password: Scalars['String'];
};

export type ChatHistory = {
  __typename?: 'ChatHistory';
  message?: Maybe<Scalars['String']>;
  messageCategory: Scalars['Int'];
  messageId: Scalars['ID'];
  userAvatar?: Maybe<Scalars['String']>;
  userCode: Scalars['String'];
  userId: Scalars['ID'];
  userName?: Maybe<Scalars['String']>;
};

export type Contact = {
  __typename?: 'Contact';
  blocked: Scalars['Boolean'];
  chat: Array<Message>;
  id: Scalars['ID'];
  status: Scalars['Int'];
  userAvatar?: Maybe<Scalars['String']>;
  userCode: Scalars['String'];
  userId: Scalars['ID'];
  userName?: Maybe<Scalars['String']>;
};


export type ContactChatArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};

export type EditProfileInput = {
  avatar?: InputMaybe<Scalars['String']>;
  code: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  name: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  category: Scalars['Int'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  rxUserId: Scalars['ID'];
  status: Scalars['Int'];
  txUserId: Scalars['ID'];
};


export type MessageCreatedAtArgs = {
  format?: InputMaybe<Scalars['String']>;
};

export type MessageChanged = {
  __typename?: 'MessageChanged';
  id: Scalars['ID'];
  message?: Maybe<Message>;
  mutationType: MutationType;
  rxUserId: Scalars['ID'];
  status: Scalars['Int'];
  txUser: User;
  txUserId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  blockContact: Contact;
  changePassword: Scalars['Boolean'];
  contactApplication: Message;
  contactApproval: Message;
  deleteAccount: Scalars['Boolean'];
  deleteContact: Contact;
  deleteMessage: Message;
  editProfile: User;
  readMessage: Scalars['Int'];
  sendMessage: Message;
  signIn: Scalars['Boolean'];
  signOut: Scalars['Boolean'];
  signUp: Scalars['Boolean'];
  unblockContact: Contact;
  undeleteContact: Contact;
};


export type MutationBlockContactArgs = {
  contactId: Scalars['ID'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationContactApplicationArgs = {
  otherUserId: Scalars['ID'];
};


export type MutationContactApprovalArgs = {
  messageId: Scalars['ID'];
};


export type MutationDeleteContactArgs = {
  contactId: Scalars['ID'];
};


export type MutationDeleteMessageArgs = {
  messageId: Scalars['ID'];
};


export type MutationEditProfileArgs = {
  input: EditProfileInput;
};


export type MutationReadMessageArgs = {
  contactId: Scalars['ID'];
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUnblockContactArgs = {
  contactId: Scalars['ID'];
};


export type MutationUndeleteContactArgs = {
  contactId: Scalars['ID'];
};

export enum MutationType {
  Created = 'CREATED',
  Deleted = 'DELETED',
  Updated = 'UPDATED'
}

export type Query = {
  __typename?: 'Query';
  chatHistory: Array<ChatHistory>;
  contactInfo: Contact;
  isAuthenticated: Scalars['Boolean'];
  me: User;
  searchUser: Array<User>;
};


export type QueryContactInfoArgs = {
  contactUserId?: InputMaybe<Scalars['ID']>;
};


export type QuerySearchUserArgs = {
  userCode: Scalars['String'];
};

export type SendMessageInput = {
  contactId: Scalars['ID'];
  message: Scalars['String'];
};

export type SignInInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignUpInput = {
  avatar?: InputMaybe<Scalars['String']>;
  code: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  passwordConfirm: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  message: MessageChanged;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  code: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
  contacts: Array<Contact>;
  email: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type ChatHistoryFieldsFragment = { __typename: 'ChatHistory', userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, messageId: string, messageCategory: number, message?: string | null };

export type ContactFieldsFragment = { __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean };

export type ContactFieldsWithChatFragment = { __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean, chat: Array<{ __typename: 'Message', id: string, txUserId: string, rxUserId: string, category: number, message?: string | null, status: number, createdAt: string }> };

export type MessageFieldsFragment = { __typename: 'Message', id: string, txUserId: string, rxUserId: string, category: number, message?: string | null, status: number, createdAt: string };

export type OtherUserFieldsFragment = { __typename: 'User', id: string, code: string, name?: string | null, comment?: string | null, avatar?: string | null };

export type OwnUserFieldsFragment = { __typename: 'User', email: string, id: string, code: string, name?: string | null, comment?: string | null, avatar?: string | null };

export type OwnUserFieldsWithContactsFragment = { __typename: 'User', email: string, id: string, code: string, name?: string | null, comment?: string | null, avatar?: string | null, contacts: Array<{ __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean }> };

export type BlockContactMutationVariables = Exact<{
  contactId: Scalars['ID'];
}>;


export type BlockContactMutation = { __typename?: 'Mutation', blockContact: { __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean } };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type ContactApplicationMutationVariables = Exact<{
  otherUserId: Scalars['ID'];
  chatTimeFormat?: InputMaybe<Scalars['String']>;
}>;


export type ContactApplicationMutation = { __typename?: 'Mutation', contactApplication: { __typename: 'Message', id: string, txUserId: string, rxUserId: string, category: number, message?: string | null, status: number, createdAt: string } };

export type ContactApprovalMutationVariables = Exact<{
  messageId: Scalars['ID'];
  chatTimeFormat?: InputMaybe<Scalars['String']>;
}>;


export type ContactApprovalMutation = { __typename?: 'Mutation', contactApproval: { __typename: 'Message', id: string, txUserId: string, rxUserId: string, category: number, message?: string | null, status: number, createdAt: string } };

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: boolean };

export type DeleteContactMutationVariables = Exact<{
  contactId: Scalars['ID'];
}>;


export type DeleteContactMutation = { __typename?: 'Mutation', deleteContact: { __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean } };

export type DeleteMessageMutationVariables = Exact<{
  messageId: Scalars['ID'];
  chatTimeFormat?: InputMaybe<Scalars['String']>;
}>;


export type DeleteMessageMutation = { __typename?: 'Mutation', deleteMessage: { __typename: 'Message', id: string, txUserId: string, rxUserId: string, category: number, message?: string | null, status: number, createdAt: string } };

export type EditProfileMutationVariables = Exact<{
  input: EditProfileInput;
}>;


export type EditProfileMutation = { __typename?: 'Mutation', editProfile: { __typename: 'User', email: string, id: string, code: string, name?: string | null, comment?: string | null, avatar?: string | null } };

export type ReadMessageMutationVariables = Exact<{
  contactId: Scalars['ID'];
}>;


export type ReadMessageMutation = { __typename?: 'Mutation', readMessage: number };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
  chatTimeFormat?: InputMaybe<Scalars['String']>;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename: 'Message', id: string, txUserId: string, rxUserId: string, category: number, message?: string | null, status: number, createdAt: string } };

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: boolean };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut: boolean };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: boolean };

export type UnblockContactMutationVariables = Exact<{
  contactId: Scalars['ID'];
}>;


export type UnblockContactMutation = { __typename?: 'Mutation', unblockContact: { __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean } };

export type UndeleteContactMutationVariables = Exact<{
  contactId: Scalars['ID'];
}>;


export type UndeleteContactMutation = { __typename?: 'Mutation', undeleteContact: { __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean } };

export type InitQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset?: InputMaybe<Scalars['Int']>;
  chatTimeFormat?: InputMaybe<Scalars['String']>;
}>;


export type InitQuery = { __typename?: 'Query', me: { __typename: 'User', email: string, id: string, code: string, name?: string | null, comment?: string | null, avatar?: string | null, contacts: Array<{ __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean }> }, chatHistory: Array<{ __typename: 'ChatHistory', userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, messageId: string, messageCategory: number, message?: string | null }>, contactInfo: { __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean, chat: Array<{ __typename: 'Message', id: string, txUserId: string, rxUserId: string, category: number, message?: string | null, status: number, createdAt: string }> } };

export type ChatHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type ChatHistoryQuery = { __typename?: 'Query', chatHistory: Array<{ __typename: 'ChatHistory', userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, messageId: string, messageCategory: number, message?: string | null }> };

export type ContactInfoQueryVariables = Exact<{
  contactUserId: Scalars['ID'];
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  chatTimeFormat?: InputMaybe<Scalars['String']>;
}>;


export type ContactInfoQuery = { __typename?: 'Query', contactInfo: { __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean, chat: Array<{ __typename: 'Message', id: string, txUserId: string, rxUserId: string, category: number, message?: string | null, status: number, createdAt: string }> } };

export type IsAuthenticatedQueryVariables = Exact<{ [key: string]: never; }>;


export type IsAuthenticatedQuery = { __typename?: 'Query', isAuthenticated: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename: 'User', email: string, id: string, code: string, name?: string | null, comment?: string | null, avatar?: string | null, contacts: Array<{ __typename: 'Contact', id: string, userId: string, userCode: string, userName?: string | null, userAvatar?: string | null, status: number, blocked: boolean }> } };

export type SearchUserQueryVariables = Exact<{
  userCode: Scalars['String'];
}>;


export type SearchUserQuery = { __typename?: 'Query', searchUser: Array<{ __typename: 'User', id: string, code: string, name?: string | null, comment?: string | null, avatar?: string | null }> };

export const ChatHistoryFieldsFragmentDoc = gql`
    fragment ChatHistoryFields on ChatHistory {
  __typename
  userId
  userCode
  userName
  userAvatar
  messageId
  messageCategory
  message
}
    `;
export const ContactFieldsFragmentDoc = gql`
    fragment ContactFields on Contact {
  __typename
  id
  userId
  userCode
  userName
  userAvatar
  status
  blocked
}
    `;
export const MessageFieldsFragmentDoc = gql`
    fragment MessageFields on Message {
  __typename
  id
  txUserId
  rxUserId
  category
  message
  status
  createdAt(format: $chatTimeFormat)
}
    `;
export const ContactFieldsWithChatFragmentDoc = gql`
    fragment ContactFieldsWithChat on Contact {
  ...ContactFields
  chat(limit: $limit, offset: $offset) {
    ...MessageFields
  }
}
    ${ContactFieldsFragmentDoc}
${MessageFieldsFragmentDoc}`;
export const OtherUserFieldsFragmentDoc = gql`
    fragment OtherUserFields on User {
  __typename
  id
  code
  name
  comment
  avatar
}
    `;
export const OwnUserFieldsFragmentDoc = gql`
    fragment OwnUserFields on User {
  ...OtherUserFields
  email
}
    ${OtherUserFieldsFragmentDoc}`;
export const OwnUserFieldsWithContactsFragmentDoc = gql`
    fragment OwnUserFieldsWithContacts on User {
  ...OwnUserFields
  contacts {
    ...ContactFields
  }
}
    ${OwnUserFieldsFragmentDoc}
${ContactFieldsFragmentDoc}`;
export const BlockContactDocument = gql`
    mutation BlockContact($contactId: ID!) {
  blockContact(contactId: $contactId) {
    ...ContactFields
  }
}
    ${ContactFieldsFragmentDoc}`;
export type BlockContactMutationFn = Apollo.MutationFunction<BlockContactMutation, BlockContactMutationVariables>;

/**
 * __useBlockContactMutation__
 *
 * To run a mutation, you first call `useBlockContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBlockContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [blockContactMutation, { data, loading, error }] = useBlockContactMutation({
 *   variables: {
 *      contactId: // value for 'contactId'
 *   },
 * });
 */
export function useBlockContactMutation(baseOptions?: Apollo.MutationHookOptions<BlockContactMutation, BlockContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BlockContactMutation, BlockContactMutationVariables>(BlockContactDocument, options);
      }
export type BlockContactMutationHookResult = ReturnType<typeof useBlockContactMutation>;
export type BlockContactMutationResult = Apollo.MutationResult<BlockContactMutation>;
export type BlockContactMutationOptions = Apollo.BaseMutationOptions<BlockContactMutation, BlockContactMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($input: ChangePasswordInput!) {
  changePassword(input: $input)
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ContactApplicationDocument = gql`
    mutation ContactApplication($otherUserId: ID!, $chatTimeFormat: String) {
  contactApplication(otherUserId: $otherUserId) {
    ...MessageFields
  }
}
    ${MessageFieldsFragmentDoc}`;
export type ContactApplicationMutationFn = Apollo.MutationFunction<ContactApplicationMutation, ContactApplicationMutationVariables>;

/**
 * __useContactApplicationMutation__
 *
 * To run a mutation, you first call `useContactApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useContactApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [contactApplicationMutation, { data, loading, error }] = useContactApplicationMutation({
 *   variables: {
 *      otherUserId: // value for 'otherUserId'
 *      chatTimeFormat: // value for 'chatTimeFormat'
 *   },
 * });
 */
export function useContactApplicationMutation(baseOptions?: Apollo.MutationHookOptions<ContactApplicationMutation, ContactApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ContactApplicationMutation, ContactApplicationMutationVariables>(ContactApplicationDocument, options);
      }
export type ContactApplicationMutationHookResult = ReturnType<typeof useContactApplicationMutation>;
export type ContactApplicationMutationResult = Apollo.MutationResult<ContactApplicationMutation>;
export type ContactApplicationMutationOptions = Apollo.BaseMutationOptions<ContactApplicationMutation, ContactApplicationMutationVariables>;
export const ContactApprovalDocument = gql`
    mutation ContactApproval($messageId: ID!, $chatTimeFormat: String) {
  contactApproval(messageId: $messageId) {
    ...MessageFields
  }
}
    ${MessageFieldsFragmentDoc}`;
export type ContactApprovalMutationFn = Apollo.MutationFunction<ContactApprovalMutation, ContactApprovalMutationVariables>;

/**
 * __useContactApprovalMutation__
 *
 * To run a mutation, you first call `useContactApprovalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useContactApprovalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [contactApprovalMutation, { data, loading, error }] = useContactApprovalMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *      chatTimeFormat: // value for 'chatTimeFormat'
 *   },
 * });
 */
export function useContactApprovalMutation(baseOptions?: Apollo.MutationHookOptions<ContactApprovalMutation, ContactApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ContactApprovalMutation, ContactApprovalMutationVariables>(ContactApprovalDocument, options);
      }
export type ContactApprovalMutationHookResult = ReturnType<typeof useContactApprovalMutation>;
export type ContactApprovalMutationResult = Apollo.MutationResult<ContactApprovalMutation>;
export type ContactApprovalMutationOptions = Apollo.BaseMutationOptions<ContactApprovalMutation, ContactApprovalMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation DeleteAccount {
  deleteAccount
}
    `;
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const DeleteContactDocument = gql`
    mutation DeleteContact($contactId: ID!) {
  deleteContact(contactId: $contactId) {
    ...ContactFields
  }
}
    ${ContactFieldsFragmentDoc}`;
export type DeleteContactMutationFn = Apollo.MutationFunction<DeleteContactMutation, DeleteContactMutationVariables>;

/**
 * __useDeleteContactMutation__
 *
 * To run a mutation, you first call `useDeleteContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteContactMutation, { data, loading, error }] = useDeleteContactMutation({
 *   variables: {
 *      contactId: // value for 'contactId'
 *   },
 * });
 */
export function useDeleteContactMutation(baseOptions?: Apollo.MutationHookOptions<DeleteContactMutation, DeleteContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteContactMutation, DeleteContactMutationVariables>(DeleteContactDocument, options);
      }
export type DeleteContactMutationHookResult = ReturnType<typeof useDeleteContactMutation>;
export type DeleteContactMutationResult = Apollo.MutationResult<DeleteContactMutation>;
export type DeleteContactMutationOptions = Apollo.BaseMutationOptions<DeleteContactMutation, DeleteContactMutationVariables>;
export const DeleteMessageDocument = gql`
    mutation DeleteMessage($messageId: ID!, $chatTimeFormat: String) {
  deleteMessage(messageId: $messageId) {
    ...MessageFields
  }
}
    ${MessageFieldsFragmentDoc}`;
export type DeleteMessageMutationFn = Apollo.MutationFunction<DeleteMessageMutation, DeleteMessageMutationVariables>;

/**
 * __useDeleteMessageMutation__
 *
 * To run a mutation, you first call `useDeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMessageMutation, { data, loading, error }] = useDeleteMessageMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *      chatTimeFormat: // value for 'chatTimeFormat'
 *   },
 * });
 */
export function useDeleteMessageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, options);
      }
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>;
export type DeleteMessageMutationResult = Apollo.MutationResult<DeleteMessageMutation>;
export type DeleteMessageMutationOptions = Apollo.BaseMutationOptions<DeleteMessageMutation, DeleteMessageMutationVariables>;
export const EditProfileDocument = gql`
    mutation EditProfile($input: EditProfileInput!) {
  editProfile(input: $input) {
    ...OwnUserFields
  }
}
    ${OwnUserFieldsFragmentDoc}`;
export type EditProfileMutationFn = Apollo.MutationFunction<EditProfileMutation, EditProfileMutationVariables>;

/**
 * __useEditProfileMutation__
 *
 * To run a mutation, you first call `useEditProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProfileMutation, { data, loading, error }] = useEditProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditProfileMutation(baseOptions?: Apollo.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, options);
      }
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>;
export type EditProfileMutationResult = Apollo.MutationResult<EditProfileMutation>;
export type EditProfileMutationOptions = Apollo.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>;
export const ReadMessageDocument = gql`
    mutation ReadMessage($contactId: ID!) {
  readMessage(contactId: $contactId)
}
    `;
export type ReadMessageMutationFn = Apollo.MutationFunction<ReadMessageMutation, ReadMessageMutationVariables>;

/**
 * __useReadMessageMutation__
 *
 * To run a mutation, you first call `useReadMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readMessageMutation, { data, loading, error }] = useReadMessageMutation({
 *   variables: {
 *      contactId: // value for 'contactId'
 *   },
 * });
 */
export function useReadMessageMutation(baseOptions?: Apollo.MutationHookOptions<ReadMessageMutation, ReadMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReadMessageMutation, ReadMessageMutationVariables>(ReadMessageDocument, options);
      }
export type ReadMessageMutationHookResult = ReturnType<typeof useReadMessageMutation>;
export type ReadMessageMutationResult = Apollo.MutationResult<ReadMessageMutation>;
export type ReadMessageMutationOptions = Apollo.BaseMutationOptions<ReadMessageMutation, ReadMessageMutationVariables>;
export const SendMessageDocument = gql`
    mutation SendMessage($input: SendMessageInput!, $chatTimeFormat: String) {
  sendMessage(input: $input) {
    ...MessageFields
  }
}
    ${MessageFieldsFragmentDoc}`;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *      chatTimeFormat: // value for 'chatTimeFormat'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const SignInDocument = gql`
    mutation SignIn($input: SignInInput!) {
  signIn(input: $input)
}
    `;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignOutDocument = gql`
    mutation SignOut {
  signOut
}
    `;
export type SignOutMutationFn = Apollo.MutationFunction<SignOutMutation, SignOutMutationVariables>;

/**
 * __useSignOutMutation__
 *
 * To run a mutation, you first call `useSignOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSignOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignOutMutation(baseOptions?: Apollo.MutationHookOptions<SignOutMutation, SignOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument, options);
      }
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = Apollo.MutationResult<SignOutMutation>;
export type SignOutMutationOptions = Apollo.BaseMutationOptions<SignOutMutation, SignOutMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($input: SignUpInput!) {
  signUp(input: $input)
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const UnblockContactDocument = gql`
    mutation UnblockContact($contactId: ID!) {
  unblockContact(contactId: $contactId) {
    ...ContactFields
  }
}
    ${ContactFieldsFragmentDoc}`;
export type UnblockContactMutationFn = Apollo.MutationFunction<UnblockContactMutation, UnblockContactMutationVariables>;

/**
 * __useUnblockContactMutation__
 *
 * To run a mutation, you first call `useUnblockContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnblockContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unblockContactMutation, { data, loading, error }] = useUnblockContactMutation({
 *   variables: {
 *      contactId: // value for 'contactId'
 *   },
 * });
 */
export function useUnblockContactMutation(baseOptions?: Apollo.MutationHookOptions<UnblockContactMutation, UnblockContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnblockContactMutation, UnblockContactMutationVariables>(UnblockContactDocument, options);
      }
export type UnblockContactMutationHookResult = ReturnType<typeof useUnblockContactMutation>;
export type UnblockContactMutationResult = Apollo.MutationResult<UnblockContactMutation>;
export type UnblockContactMutationOptions = Apollo.BaseMutationOptions<UnblockContactMutation, UnblockContactMutationVariables>;
export const UndeleteContactDocument = gql`
    mutation UndeleteContact($contactId: ID!) {
  undeleteContact(contactId: $contactId) {
    ...ContactFields
  }
}
    ${ContactFieldsFragmentDoc}`;
export type UndeleteContactMutationFn = Apollo.MutationFunction<UndeleteContactMutation, UndeleteContactMutationVariables>;

/**
 * __useUndeleteContactMutation__
 *
 * To run a mutation, you first call `useUndeleteContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUndeleteContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [undeleteContactMutation, { data, loading, error }] = useUndeleteContactMutation({
 *   variables: {
 *      contactId: // value for 'contactId'
 *   },
 * });
 */
export function useUndeleteContactMutation(baseOptions?: Apollo.MutationHookOptions<UndeleteContactMutation, UndeleteContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UndeleteContactMutation, UndeleteContactMutationVariables>(UndeleteContactDocument, options);
      }
export type UndeleteContactMutationHookResult = ReturnType<typeof useUndeleteContactMutation>;
export type UndeleteContactMutationResult = Apollo.MutationResult<UndeleteContactMutation>;
export type UndeleteContactMutationOptions = Apollo.BaseMutationOptions<UndeleteContactMutation, UndeleteContactMutationVariables>;
export const InitDocument = gql`
    query Init($limit: Int!, $offset: Int = 0, $chatTimeFormat: String) {
  me {
    ...OwnUserFieldsWithContacts
  }
  chatHistory {
    ...ChatHistoryFields
  }
  contactInfo {
    ...ContactFieldsWithChat
  }
}
    ${OwnUserFieldsWithContactsFragmentDoc}
${ChatHistoryFieldsFragmentDoc}
${ContactFieldsWithChatFragmentDoc}`;

/**
 * __useInitQuery__
 *
 * To run a query within a React component, call `useInitQuery` and pass it any options that fit your needs.
 * When your component renders, `useInitQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInitQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      chatTimeFormat: // value for 'chatTimeFormat'
 *   },
 * });
 */
export function useInitQuery(baseOptions: Apollo.QueryHookOptions<InitQuery, InitQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InitQuery, InitQueryVariables>(InitDocument, options);
      }
export function useInitLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitQuery, InitQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InitQuery, InitQueryVariables>(InitDocument, options);
        }
export type InitQueryHookResult = ReturnType<typeof useInitQuery>;
export type InitLazyQueryHookResult = ReturnType<typeof useInitLazyQuery>;
export type InitQueryResult = Apollo.QueryResult<InitQuery, InitQueryVariables>;
export const ChatHistoryDocument = gql`
    query ChatHistory {
  chatHistory {
    ...ChatHistoryFields
  }
}
    ${ChatHistoryFieldsFragmentDoc}`;

/**
 * __useChatHistoryQuery__
 *
 * To run a query within a React component, call `useChatHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useChatHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChatHistoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useChatHistoryQuery(baseOptions?: Apollo.QueryHookOptions<ChatHistoryQuery, ChatHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChatHistoryQuery, ChatHistoryQueryVariables>(ChatHistoryDocument, options);
      }
export function useChatHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChatHistoryQuery, ChatHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChatHistoryQuery, ChatHistoryQueryVariables>(ChatHistoryDocument, options);
        }
export type ChatHistoryQueryHookResult = ReturnType<typeof useChatHistoryQuery>;
export type ChatHistoryLazyQueryHookResult = ReturnType<typeof useChatHistoryLazyQuery>;
export type ChatHistoryQueryResult = Apollo.QueryResult<ChatHistoryQuery, ChatHistoryQueryVariables>;
export const ContactInfoDocument = gql`
    query ContactInfo($contactUserId: ID!, $limit: Int!, $offset: Int!, $chatTimeFormat: String) {
  contactInfo(contactUserId: $contactUserId) {
    ...ContactFieldsWithChat
  }
}
    ${ContactFieldsWithChatFragmentDoc}`;

/**
 * __useContactInfoQuery__
 *
 * To run a query within a React component, call `useContactInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useContactInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContactInfoQuery({
 *   variables: {
 *      contactUserId: // value for 'contactUserId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      chatTimeFormat: // value for 'chatTimeFormat'
 *   },
 * });
 */
export function useContactInfoQuery(baseOptions: Apollo.QueryHookOptions<ContactInfoQuery, ContactInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ContactInfoQuery, ContactInfoQueryVariables>(ContactInfoDocument, options);
      }
export function useContactInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ContactInfoQuery, ContactInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ContactInfoQuery, ContactInfoQueryVariables>(ContactInfoDocument, options);
        }
export type ContactInfoQueryHookResult = ReturnType<typeof useContactInfoQuery>;
export type ContactInfoLazyQueryHookResult = ReturnType<typeof useContactInfoLazyQuery>;
export type ContactInfoQueryResult = Apollo.QueryResult<ContactInfoQuery, ContactInfoQueryVariables>;
export const IsAuthenticatedDocument = gql`
    query IsAuthenticated {
  isAuthenticated
}
    `;

/**
 * __useIsAuthenticatedQuery__
 *
 * To run a query within a React component, call `useIsAuthenticatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsAuthenticatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsAuthenticatedQuery({
 *   variables: {
 *   },
 * });
 */
export function useIsAuthenticatedQuery(baseOptions?: Apollo.QueryHookOptions<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(IsAuthenticatedDocument, options);
      }
export function useIsAuthenticatedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(IsAuthenticatedDocument, options);
        }
export type IsAuthenticatedQueryHookResult = ReturnType<typeof useIsAuthenticatedQuery>;
export type IsAuthenticatedLazyQueryHookResult = ReturnType<typeof useIsAuthenticatedLazyQuery>;
export type IsAuthenticatedQueryResult = Apollo.QueryResult<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...OwnUserFieldsWithContacts
  }
}
    ${OwnUserFieldsWithContactsFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const SearchUserDocument = gql`
    query SearchUser($userCode: String!) {
  searchUser(userCode: $userCode) {
    ...OtherUserFields
  }
}
    ${OtherUserFieldsFragmentDoc}`;

/**
 * __useSearchUserQuery__
 *
 * To run a query within a React component, call `useSearchUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUserQuery({
 *   variables: {
 *      userCode: // value for 'userCode'
 *   },
 * });
 */
export function useSearchUserQuery(baseOptions: Apollo.QueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options);
      }
export function useSearchUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options);
        }
export type SearchUserQueryHookResult = ReturnType<typeof useSearchUserQuery>;
export type SearchUserLazyQueryHookResult = ReturnType<typeof useSearchUserLazyQuery>;
export type SearchUserQueryResult = Apollo.QueryResult<SearchUserQuery, SearchUserQueryVariables>;