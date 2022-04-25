import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type ChangePasswordInput = {
  newPassword: Scalars['String']
  newPasswordConfirm: Scalars['String']
  password: Scalars['String']
}

export type Contact = {
  __typename?: 'Contact'
  blocked: Scalars['Boolean']
  chat: Array<Message>
  id: Scalars['ID']
  latestMessage?: Maybe<LatestMessage>
  status: Scalars['Int']
  userAvatar?: Maybe<Scalars['String']>
  userCode: Scalars['String']
  userId: Scalars['ID']
  userName?: Maybe<Scalars['String']>
}

export type ContactChatArgs = {
  cursor?: InputMaybe<Scalars['Int']>
  limit?: InputMaybe<Scalars['Int']>
}

export type EditProfileInput = {
  avatar?: InputMaybe<Scalars['String']>
  code: Scalars['String']
  comment?: InputMaybe<Scalars['String']>
  email: Scalars['String']
  name: Scalars['String']
}

export type LatestMessage = {
  __typename?: 'LatestMessage'
  message?: Maybe<Scalars['String']>
  messageCategory: Scalars['Int']
  messageId: Scalars['ID']
  messageStatus: Scalars['Int']
  userAvatar?: Maybe<Scalars['String']>
  userCode: Scalars['String']
  userId: Scalars['ID']
  userName?: Maybe<Scalars['String']>
}

export type Message = {
  __typename?: 'Message'
  category: Scalars['Int']
  createdAt: Scalars['String']
  id: Scalars['ID']
  message?: Maybe<Scalars['String']>
  rxUserId: Scalars['ID']
  status: Scalars['Int']
  txUserId: Scalars['ID']
}

export type MessageCreatedAtArgs = {
  format?: InputMaybe<Scalars['String']>
}

export type MessageChanged = {
  __typename?: 'MessageChanged'
  contactId?: Maybe<Scalars['ID']>
  contactStatus?: Maybe<Scalars['Int']>
  latestMessage?: Maybe<LatestMessage>
  message?: Maybe<Message>
  messages?: Maybe<Array<Message>>
  mutationType: MutationType
  rxUserId: Scalars['ID']
  txUserId: Scalars['ID']
}

export type Mutation = {
  __typename?: 'Mutation'
  blockContact: Contact
  changePassword: Scalars['Boolean']
  contactApplication: MessageChanged
  contactApproval: MessageChanged
  deleteAccount: Scalars['Boolean']
  deleteContact: Contact
  deleteMessage: MessageChanged
  editProfile: User
  readMessages: MessageChanged
  sendMessage: MessageChanged
  signIn: Scalars['Boolean']
  signOut: Scalars['Boolean']
  signUp: Scalars['Boolean']
  unblockContact: Contact
  undeleteContact: Contact
}

export type MutationBlockContactArgs = {
  contactId: Scalars['ID']
}

export type MutationChangePasswordArgs = {
  input: ChangePasswordInput
}

export type MutationContactApplicationArgs = {
  otherUserId: Scalars['ID']
}

export type MutationContactApprovalArgs = {
  messageId: Scalars['ID']
}

export type MutationDeleteContactArgs = {
  contactId: Scalars['ID']
}

export type MutationDeleteMessageArgs = {
  messageId: Scalars['ID']
}

export type MutationEditProfileArgs = {
  input: EditProfileInput
}

export type MutationReadMessagesArgs = {
  otherUserId: Scalars['ID']
}

export type MutationSendMessageArgs = {
  input: SendMessageInput
}

export type MutationSignInArgs = {
  input: SignInInput
}

export type MutationSignUpArgs = {
  input: SignUpInput
}

export type MutationUnblockContactArgs = {
  contactId: Scalars['ID']
}

export type MutationUndeleteContactArgs = {
  contactId: Scalars['ID']
}

export enum MutationType {
  Created = 'CREATED',
  Deleted = 'DELETED',
  Updated = 'UPDATED'
}

export type Query = {
  __typename?: 'Query'
  contactInfo: Contact
  contacts: Array<Contact>
  isAuthenticated: Scalars['Boolean']
  latestMessages: Array<LatestMessage>
  me: User
  searchUser: Array<User>
}

export type QueryContactInfoArgs = {
  contactUserId?: InputMaybe<Scalars['ID']>
}

export type QuerySearchUserArgs = {
  userCode: Scalars['String']
}

export type SendMessageInput = {
  contactId: Scalars['ID']
  message: Scalars['String']
}

export type SignInInput = {
  email: Scalars['String']
  password: Scalars['String']
}

export type SignUpInput = {
  avatar?: InputMaybe<Scalars['String']>
  code: Scalars['String']
  comment?: InputMaybe<Scalars['String']>
  email: Scalars['String']
  name: Scalars['String']
  password: Scalars['String']
  passwordConfirm: Scalars['String']
}

export type Subscription = {
  __typename?: 'Subscription'
  messageSubscription: MessageChanged
}

export type User = {
  __typename?: 'User'
  avatar?: Maybe<Scalars['String']>
  code: Scalars['String']
  comment?: Maybe<Scalars['String']>
  email: Scalars['String']
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
}

export type ContactFieldsFragment = {
  __typename: 'Contact'
  id: string
  userId: string
  userCode: string
  userName?: string | null
  userAvatar?: string | null
  status: number
  blocked: boolean
}

export type ContactFieldsWithLatestMessageFragment = {
  __typename: 'Contact'
  id: string
  userId: string
  userCode: string
  userName?: string | null
  userAvatar?: string | null
  status: number
  blocked: boolean
  latestMessage?: {
    __typename: 'LatestMessage'
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    messageId: string
    messageCategory: number
    message?: string | null
    messageStatus: number
  } | null
}

export type ContactFieldsWithChatFragment = {
  __typename: 'Contact'
  id: string
  userId: string
  userCode: string
  userName?: string | null
  userAvatar?: string | null
  status: number
  blocked: boolean
  chat: Array<{
    __typename: 'Message'
    id: string
    txUserId: string
    rxUserId: string
    category: number
    message?: string | null
    status: number
    createdAt: string
  }>
}

export type LatestMessageFieldsFragment = {
  __typename: 'LatestMessage'
  userId: string
  userCode: string
  userName?: string | null
  userAvatar?: string | null
  messageId: string
  messageCategory: number
  message?: string | null
  messageStatus: number
}

export type MessageChangedFieldsFragment = {
  __typename: 'MessageChanged'
  txUserId: string
  rxUserId: string
  contactId?: string | null
  contactStatus?: number | null
  mutationType: MutationType
  message?: {
    __typename: 'Message'
    id: string
    txUserId: string
    rxUserId: string
    category: number
    message?: string | null
    status: number
    createdAt: string
  } | null
  messages?: Array<{
    __typename: 'Message'
    id: string
    txUserId: string
    rxUserId: string
    category: number
    message?: string | null
    status: number
    createdAt: string
  }> | null
  latestMessage?: {
    __typename: 'LatestMessage'
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    messageId: string
    messageCategory: number
    message?: string | null
    messageStatus: number
  } | null
}

export type MessageFieldsFragment = {
  __typename: 'Message'
  id: string
  txUserId: string
  rxUserId: string
  category: number
  message?: string | null
  status: number
  createdAt: string
}

export type OtherUserFieldsFragment = {
  __typename: 'User'
  id: string
  code: string
  name?: string | null
  comment?: string | null
  avatar?: string | null
}

export type OwnUserFieldsFragment = {
  __typename: 'User'
  email: string
  id: string
  code: string
  name?: string | null
  comment?: string | null
  avatar?: string | null
}

export type BlockContactMutationVariables = Exact<{
  contactId: Scalars['ID']
}>

export type BlockContactMutation = {
  __typename?: 'Mutation'
  blockContact: {
    __typename: 'Contact'
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
  }
}

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput
}>

export type ChangePasswordMutation = { __typename?: 'Mutation'; changePassword: boolean }

export type ContactApplicationMutationVariables = Exact<{
  otherUserId: Scalars['ID']
  chatTimeFormat?: InputMaybe<Scalars['String']>
}>

export type ContactApplicationMutation = {
  __typename?: 'Mutation'
  contactApplication: {
    __typename: 'MessageChanged'
    txUserId: string
    rxUserId: string
    contactId?: string | null
    contactStatus?: number | null
    mutationType: MutationType
    message?: {
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    } | null
    messages?: Array<{
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
    } | null
  }
}

export type ContactApprovalMutationVariables = Exact<{
  messageId: Scalars['ID']
  chatTimeFormat?: InputMaybe<Scalars['String']>
}>

export type ContactApprovalMutation = {
  __typename?: 'Mutation'
  contactApproval: {
    __typename: 'MessageChanged'
    txUserId: string
    rxUserId: string
    contactId?: string | null
    contactStatus?: number | null
    mutationType: MutationType
    message?: {
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    } | null
    messages?: Array<{
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
    } | null
  }
}

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never }>

export type DeleteAccountMutation = { __typename?: 'Mutation'; deleteAccount: boolean }

export type DeleteContactMutationVariables = Exact<{
  contactId: Scalars['ID']
}>

export type DeleteContactMutation = {
  __typename?: 'Mutation'
  deleteContact: {
    __typename: 'Contact'
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
  }
}

export type DeleteMessageMutationVariables = Exact<{
  messageId: Scalars['ID']
  chatTimeFormat?: InputMaybe<Scalars['String']>
}>

export type DeleteMessageMutation = {
  __typename?: 'Mutation'
  deleteMessage: {
    __typename: 'MessageChanged'
    txUserId: string
    rxUserId: string
    contactId?: string | null
    contactStatus?: number | null
    mutationType: MutationType
    message?: {
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    } | null
    messages?: Array<{
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
    } | null
  }
}

export type EditProfileMutationVariables = Exact<{
  input: EditProfileInput
}>

export type EditProfileMutation = {
  __typename?: 'Mutation'
  editProfile: {
    __typename: 'User'
    email: string
    id: string
    code: string
    name?: string | null
    comment?: string | null
    avatar?: string | null
  }
}

export type ReadMessagesMutationVariables = Exact<{
  otherUserId: Scalars['ID']
  chatTimeFormat?: InputMaybe<Scalars['String']>
}>

export type ReadMessagesMutation = {
  __typename?: 'Mutation'
  readMessages: {
    __typename: 'MessageChanged'
    txUserId: string
    rxUserId: string
    contactId?: string | null
    contactStatus?: number | null
    mutationType: MutationType
    message?: {
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    } | null
    messages?: Array<{
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
    } | null
  }
}

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput
  chatTimeFormat?: InputMaybe<Scalars['String']>
}>

export type SendMessageMutation = {
  __typename?: 'Mutation'
  sendMessage: {
    __typename: 'MessageChanged'
    txUserId: string
    rxUserId: string
    contactId?: string | null
    contactStatus?: number | null
    mutationType: MutationType
    message?: {
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    } | null
    messages?: Array<{
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
    } | null
  }
}

export type SignInMutationVariables = Exact<{
  input: SignInInput
}>

export type SignInMutation = { __typename?: 'Mutation'; signIn: boolean }

export type SignOutMutationVariables = Exact<{ [key: string]: never }>

export type SignOutMutation = { __typename?: 'Mutation'; signOut: boolean }

export type SignUpMutationVariables = Exact<{
  input: SignUpInput
}>

export type SignUpMutation = { __typename?: 'Mutation'; signUp: boolean }

export type UnblockContactMutationVariables = Exact<{
  contactId: Scalars['ID']
}>

export type UnblockContactMutation = {
  __typename?: 'Mutation'
  unblockContact: {
    __typename: 'Contact'
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
    } | null
  }
}

export type UndeleteContactMutationVariables = Exact<{
  contactId: Scalars['ID']
}>

export type UndeleteContactMutation = {
  __typename?: 'Mutation'
  undeleteContact: {
    __typename: 'Contact'
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
  }
}

export type InitQueryVariables = Exact<{
  contactUserId?: InputMaybe<Scalars['ID']>
  cursor?: InputMaybe<Scalars['Int']>
  limit?: InputMaybe<Scalars['Int']>
  chatTimeFormat?: InputMaybe<Scalars['String']>
}>

export type InitQuery = {
  __typename?: 'Query'
  me: {
    __typename: 'User'
    email: string
    id: string
    code: string
    name?: string | null
    comment?: string | null
    avatar?: string | null
  }
  contacts: Array<{
    __typename: 'Contact'
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
  }>
  latestMessages: Array<{
    __typename: 'LatestMessage'
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    messageId: string
    messageCategory: number
    message?: string | null
    messageStatus: number
  }>
  contactInfo: {
    __typename: 'Contact'
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
    chat: Array<{
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    }>
  }
}

export type ContactInfoQueryVariables = Exact<{
  contactUserId?: InputMaybe<Scalars['ID']>
  cursor?: InputMaybe<Scalars['Int']>
  limit?: InputMaybe<Scalars['Int']>
  chatTimeFormat?: InputMaybe<Scalars['String']>
}>

export type ContactInfoQuery = {
  __typename?: 'Query'
  contactInfo: {
    __typename: 'Contact'
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
    chat: Array<{
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    }>
  }
}

export type ContactsQueryVariables = Exact<{ [key: string]: never }>

export type ContactsQuery = {
  __typename?: 'Query'
  contacts: Array<{
    __typename: 'Contact'
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
  }>
}

export type IsAuthenticatedQueryVariables = Exact<{ [key: string]: never }>

export type IsAuthenticatedQuery = { __typename?: 'Query'; isAuthenticated: boolean }

export type LatestMessagesQueryVariables = Exact<{ [key: string]: never }>

export type LatestMessagesQuery = {
  __typename?: 'Query'
  latestMessages: Array<{
    __typename: 'LatestMessage'
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    messageId: string
    messageCategory: number
    message?: string | null
    messageStatus: number
  }>
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: 'Query'
  me: {
    __typename: 'User'
    email: string
    id: string
    code: string
    name?: string | null
    comment?: string | null
    avatar?: string | null
  }
}

export type SearchUserQueryVariables = Exact<{
  userCode: Scalars['String']
}>

export type SearchUserQuery = {
  __typename?: 'Query'
  searchUser: Array<{
    __typename: 'User'
    id: string
    code: string
    name?: string | null
    comment?: string | null
    avatar?: string | null
  }>
}

export type MessageSubscriptionVariables = Exact<{
  chatTimeFormat?: InputMaybe<Scalars['String']>
}>

export type MessageSubscription = {
  __typename?: 'Subscription'
  messageSubscription: {
    __typename: 'MessageChanged'
    txUserId: string
    rxUserId: string
    contactId?: string | null
    contactStatus?: number | null
    mutationType: MutationType
    message?: {
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    } | null
    messages?: Array<{
      __typename: 'Message'
      id: string
      txUserId: string
      rxUserId: string
      category: number
      message?: string | null
      status: number
      createdAt: string
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
    } | null
  }
}

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
`
export const LatestMessageFieldsFragmentDoc = gql`
  fragment LatestMessageFields on LatestMessage {
    __typename
    userId
    userCode
    userName
    userAvatar
    messageId
    messageCategory
    message
    messageStatus
  }
`
export const ContactFieldsWithLatestMessageFragmentDoc = gql`
  fragment ContactFieldsWithLatestMessage on Contact {
    ...ContactFields
    latestMessage {
      ...LatestMessageFields
    }
  }
  ${ContactFieldsFragmentDoc}
  ${LatestMessageFieldsFragmentDoc}
`
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
`
export const ContactFieldsWithChatFragmentDoc = gql`
  fragment ContactFieldsWithChat on Contact {
    ...ContactFields
    chat(cursor: $cursor, limit: $limit) {
      ...MessageFields
    }
  }
  ${ContactFieldsFragmentDoc}
  ${MessageFieldsFragmentDoc}
`
export const MessageChangedFieldsFragmentDoc = gql`
  fragment MessageChangedFields on MessageChanged {
    __typename
    txUserId
    rxUserId
    contactId
    contactStatus
    message {
      ...MessageFields
    }
    messages {
      ...MessageFields
    }
    mutationType
    latestMessage {
      ...LatestMessageFields
    }
  }
  ${MessageFieldsFragmentDoc}
  ${LatestMessageFieldsFragmentDoc}
`
export const OtherUserFieldsFragmentDoc = gql`
  fragment OtherUserFields on User {
    __typename
    id
    code
    name
    comment
    avatar
  }
`
export const OwnUserFieldsFragmentDoc = gql`
  fragment OwnUserFields on User {
    ...OtherUserFields
    email
  }
  ${OtherUserFieldsFragmentDoc}
`
export const BlockContactDocument = gql`
  mutation BlockContact($contactId: ID!) {
    blockContact(contactId: $contactId) {
      ...ContactFields
    }
  }
  ${ContactFieldsFragmentDoc}
`
export type BlockContactMutationFn = Apollo.MutationFunction<
  BlockContactMutation,
  BlockContactMutationVariables
>

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
export function useBlockContactMutation(
  baseOptions?: Apollo.MutationHookOptions<BlockContactMutation, BlockContactMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<BlockContactMutation, BlockContactMutationVariables>(
    BlockContactDocument,
    options
  )
}
export type BlockContactMutationHookResult = ReturnType<typeof useBlockContactMutation>
export type BlockContactMutationResult = Apollo.MutationResult<BlockContactMutation>
export type BlockContactMutationOptions = Apollo.BaseMutationOptions<
  BlockContactMutation,
  BlockContactMutationVariables
>
export const ChangePasswordDocument = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`
export type ChangePasswordMutationFn = Apollo.MutationFunction<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>

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
export function useChangePasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(
    ChangePasswordDocument,
    options
  )
}
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>
export const ContactApplicationDocument = gql`
  mutation ContactApplication($otherUserId: ID!, $chatTimeFormat: String) {
    contactApplication(otherUserId: $otherUserId) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type ContactApplicationMutationFn = Apollo.MutationFunction<
  ContactApplicationMutation,
  ContactApplicationMutationVariables
>

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
export function useContactApplicationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ContactApplicationMutation,
    ContactApplicationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ContactApplicationMutation, ContactApplicationMutationVariables>(
    ContactApplicationDocument,
    options
  )
}
export type ContactApplicationMutationHookResult = ReturnType<typeof useContactApplicationMutation>
export type ContactApplicationMutationResult = Apollo.MutationResult<ContactApplicationMutation>
export type ContactApplicationMutationOptions = Apollo.BaseMutationOptions<
  ContactApplicationMutation,
  ContactApplicationMutationVariables
>
export const ContactApprovalDocument = gql`
  mutation ContactApproval($messageId: ID!, $chatTimeFormat: String) {
    contactApproval(messageId: $messageId) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type ContactApprovalMutationFn = Apollo.MutationFunction<
  ContactApprovalMutation,
  ContactApprovalMutationVariables
>

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
export function useContactApprovalMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ContactApprovalMutation,
    ContactApprovalMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ContactApprovalMutation, ContactApprovalMutationVariables>(
    ContactApprovalDocument,
    options
  )
}
export type ContactApprovalMutationHookResult = ReturnType<typeof useContactApprovalMutation>
export type ContactApprovalMutationResult = Apollo.MutationResult<ContactApprovalMutation>
export type ContactApprovalMutationOptions = Apollo.BaseMutationOptions<
  ContactApprovalMutation,
  ContactApprovalMutationVariables
>
export const DeleteAccountDocument = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`
export type DeleteAccountMutationFn = Apollo.MutationFunction<
  DeleteAccountMutation,
  DeleteAccountMutationVariables
>

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
export function useDeleteAccountMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(
    DeleteAccountDocument,
    options
  )
}
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<
  DeleteAccountMutation,
  DeleteAccountMutationVariables
>
export const DeleteContactDocument = gql`
  mutation DeleteContact($contactId: ID!) {
    deleteContact(contactId: $contactId) {
      ...ContactFields
    }
  }
  ${ContactFieldsFragmentDoc}
`
export type DeleteContactMutationFn = Apollo.MutationFunction<
  DeleteContactMutation,
  DeleteContactMutationVariables
>

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
export function useDeleteContactMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteContactMutation, DeleteContactMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteContactMutation, DeleteContactMutationVariables>(
    DeleteContactDocument,
    options
  )
}
export type DeleteContactMutationHookResult = ReturnType<typeof useDeleteContactMutation>
export type DeleteContactMutationResult = Apollo.MutationResult<DeleteContactMutation>
export type DeleteContactMutationOptions = Apollo.BaseMutationOptions<
  DeleteContactMutation,
  DeleteContactMutationVariables
>
export const DeleteMessageDocument = gql`
  mutation DeleteMessage($messageId: ID!, $chatTimeFormat: String) {
    deleteMessage(messageId: $messageId) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type DeleteMessageMutationFn = Apollo.MutationFunction<
  DeleteMessageMutation,
  DeleteMessageMutationVariables
>

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
export function useDeleteMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(
    DeleteMessageDocument,
    options
  )
}
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>
export type DeleteMessageMutationResult = Apollo.MutationResult<DeleteMessageMutation>
export type DeleteMessageMutationOptions = Apollo.BaseMutationOptions<
  DeleteMessageMutation,
  DeleteMessageMutationVariables
>
export const EditProfileDocument = gql`
  mutation EditProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ...OwnUserFields
    }
  }
  ${OwnUserFieldsFragmentDoc}
`
export type EditProfileMutationFn = Apollo.MutationFunction<
  EditProfileMutation,
  EditProfileMutationVariables
>

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
export function useEditProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<EditProfileMutation, EditProfileMutationVariables>(
    EditProfileDocument,
    options
  )
}
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>
export type EditProfileMutationResult = Apollo.MutationResult<EditProfileMutation>
export type EditProfileMutationOptions = Apollo.BaseMutationOptions<
  EditProfileMutation,
  EditProfileMutationVariables
>
export const ReadMessagesDocument = gql`
  mutation ReadMessages($otherUserId: ID!, $chatTimeFormat: String) {
    readMessages(otherUserId: $otherUserId) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type ReadMessagesMutationFn = Apollo.MutationFunction<
  ReadMessagesMutation,
  ReadMessagesMutationVariables
>

/**
 * __useReadMessagesMutation__
 *
 * To run a mutation, you first call `useReadMessagesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadMessagesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readMessagesMutation, { data, loading, error }] = useReadMessagesMutation({
 *   variables: {
 *      otherUserId: // value for 'otherUserId'
 *      chatTimeFormat: // value for 'chatTimeFormat'
 *   },
 * });
 */
export function useReadMessagesMutation(
  baseOptions?: Apollo.MutationHookOptions<ReadMessagesMutation, ReadMessagesMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ReadMessagesMutation, ReadMessagesMutationVariables>(
    ReadMessagesDocument,
    options
  )
}
export type ReadMessagesMutationHookResult = ReturnType<typeof useReadMessagesMutation>
export type ReadMessagesMutationResult = Apollo.MutationResult<ReadMessagesMutation>
export type ReadMessagesMutationOptions = Apollo.BaseMutationOptions<
  ReadMessagesMutation,
  ReadMessagesMutationVariables
>
export const SendMessageDocument = gql`
  mutation SendMessage($input: SendMessageInput!, $chatTimeFormat: String) {
    sendMessage(input: $input) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type SendMessageMutationFn = Apollo.MutationFunction<
  SendMessageMutation,
  SendMessageMutationVariables
>

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
export function useSendMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(
    SendMessageDocument,
    options
  )
}
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<
  SendMessageMutation,
  SendMessageMutationVariables
>
export const SignInDocument = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input)
  }
`
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>

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
export function useSignInMutation(
  baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options)
}
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>
export type SignInMutationOptions = Apollo.BaseMutationOptions<
  SignInMutation,
  SignInMutationVariables
>
export const SignOutDocument = gql`
  mutation SignOut {
    signOut
  }
`
export type SignOutMutationFn = Apollo.MutationFunction<SignOutMutation, SignOutMutationVariables>

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
export function useSignOutMutation(
  baseOptions?: Apollo.MutationHookOptions<SignOutMutation, SignOutMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument, options)
}
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>
export type SignOutMutationResult = Apollo.MutationResult<SignOutMutation>
export type SignOutMutationOptions = Apollo.BaseMutationOptions<
  SignOutMutation,
  SignOutMutationVariables
>
export const SignUpDocument = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input)
  }
`
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>

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
export function useSignUpMutation(
  baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options)
}
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>
export type SignUpMutationOptions = Apollo.BaseMutationOptions<
  SignUpMutation,
  SignUpMutationVariables
>
export const UnblockContactDocument = gql`
  mutation UnblockContact($contactId: ID!) {
    unblockContact(contactId: $contactId) {
      ...ContactFieldsWithLatestMessage
    }
  }
  ${ContactFieldsWithLatestMessageFragmentDoc}
`
export type UnblockContactMutationFn = Apollo.MutationFunction<
  UnblockContactMutation,
  UnblockContactMutationVariables
>

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
export function useUnblockContactMutation(
  baseOptions?: Apollo.MutationHookOptions<UnblockContactMutation, UnblockContactMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UnblockContactMutation, UnblockContactMutationVariables>(
    UnblockContactDocument,
    options
  )
}
export type UnblockContactMutationHookResult = ReturnType<typeof useUnblockContactMutation>
export type UnblockContactMutationResult = Apollo.MutationResult<UnblockContactMutation>
export type UnblockContactMutationOptions = Apollo.BaseMutationOptions<
  UnblockContactMutation,
  UnblockContactMutationVariables
>
export const UndeleteContactDocument = gql`
  mutation UndeleteContact($contactId: ID!) {
    undeleteContact(contactId: $contactId) {
      ...ContactFields
    }
  }
  ${ContactFieldsFragmentDoc}
`
export type UndeleteContactMutationFn = Apollo.MutationFunction<
  UndeleteContactMutation,
  UndeleteContactMutationVariables
>

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
export function useUndeleteContactMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UndeleteContactMutation,
    UndeleteContactMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UndeleteContactMutation, UndeleteContactMutationVariables>(
    UndeleteContactDocument,
    options
  )
}
export type UndeleteContactMutationHookResult = ReturnType<typeof useUndeleteContactMutation>
export type UndeleteContactMutationResult = Apollo.MutationResult<UndeleteContactMutation>
export type UndeleteContactMutationOptions = Apollo.BaseMutationOptions<
  UndeleteContactMutation,
  UndeleteContactMutationVariables
>
export const InitDocument = gql`
  query Init($contactUserId: ID, $cursor: Int, $limit: Int, $chatTimeFormat: String) {
    me {
      ...OwnUserFields
    }
    contacts {
      ...ContactFields
    }
    latestMessages {
      ...LatestMessageFields
    }
    contactInfo(contactUserId: $contactUserId) {
      ...ContactFieldsWithChat
    }
  }
  ${OwnUserFieldsFragmentDoc}
  ${ContactFieldsFragmentDoc}
  ${LatestMessageFieldsFragmentDoc}
  ${ContactFieldsWithChatFragmentDoc}
`

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
 *      contactUserId: // value for 'contactUserId'
 *      cursor: // value for 'cursor'
 *      limit: // value for 'limit'
 *      chatTimeFormat: // value for 'chatTimeFormat'
 *   },
 * });
 */
export function useInitQuery(baseOptions?: Apollo.QueryHookOptions<InitQuery, InitQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<InitQuery, InitQueryVariables>(InitDocument, options)
}
export function useInitLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<InitQuery, InitQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<InitQuery, InitQueryVariables>(InitDocument, options)
}
export type InitQueryHookResult = ReturnType<typeof useInitQuery>
export type InitLazyQueryHookResult = ReturnType<typeof useInitLazyQuery>
export type InitQueryResult = Apollo.QueryResult<InitQuery, InitQueryVariables>
export const ContactInfoDocument = gql`
  query ContactInfo($contactUserId: ID, $cursor: Int, $limit: Int, $chatTimeFormat: String) {
    contactInfo(contactUserId: $contactUserId) {
      ...ContactFieldsWithChat
    }
  }
  ${ContactFieldsWithChatFragmentDoc}
`

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
 *      cursor: // value for 'cursor'
 *      limit: // value for 'limit'
 *      chatTimeFormat: // value for 'chatTimeFormat'
 *   },
 * });
 */
export function useContactInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<ContactInfoQuery, ContactInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ContactInfoQuery, ContactInfoQueryVariables>(ContactInfoDocument, options)
}
export function useContactInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ContactInfoQuery, ContactInfoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ContactInfoQuery, ContactInfoQueryVariables>(
    ContactInfoDocument,
    options
  )
}
export type ContactInfoQueryHookResult = ReturnType<typeof useContactInfoQuery>
export type ContactInfoLazyQueryHookResult = ReturnType<typeof useContactInfoLazyQuery>
export type ContactInfoQueryResult = Apollo.QueryResult<ContactInfoQuery, ContactInfoQueryVariables>
export const ContactsDocument = gql`
  query Contacts {
    contacts {
      ...ContactFields
    }
  }
  ${ContactFieldsFragmentDoc}
`

/**
 * __useContactsQuery__
 *
 * To run a query within a React component, call `useContactsQuery` and pass it any options that fit your needs.
 * When your component renders, `useContactsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContactsQuery({
 *   variables: {
 *   },
 * });
 */
export function useContactsQuery(
  baseOptions?: Apollo.QueryHookOptions<ContactsQuery, ContactsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ContactsQuery, ContactsQueryVariables>(ContactsDocument, options)
}
export function useContactsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ContactsQuery, ContactsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ContactsQuery, ContactsQueryVariables>(ContactsDocument, options)
}
export type ContactsQueryHookResult = ReturnType<typeof useContactsQuery>
export type ContactsLazyQueryHookResult = ReturnType<typeof useContactsLazyQuery>
export type ContactsQueryResult = Apollo.QueryResult<ContactsQuery, ContactsQueryVariables>
export const IsAuthenticatedDocument = gql`
  query IsAuthenticated {
    isAuthenticated
  }
`

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
export function useIsAuthenticatedQuery(
  baseOptions?: Apollo.QueryHookOptions<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(
    IsAuthenticatedDocument,
    options
  )
}
export function useIsAuthenticatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(
    IsAuthenticatedDocument,
    options
  )
}
export type IsAuthenticatedQueryHookResult = ReturnType<typeof useIsAuthenticatedQuery>
export type IsAuthenticatedLazyQueryHookResult = ReturnType<typeof useIsAuthenticatedLazyQuery>
export type IsAuthenticatedQueryResult = Apollo.QueryResult<
  IsAuthenticatedQuery,
  IsAuthenticatedQueryVariables
>
export const LatestMessagesDocument = gql`
  query LatestMessages {
    latestMessages {
      ...LatestMessageFields
    }
  }
  ${LatestMessageFieldsFragmentDoc}
`

/**
 * __useLatestMessagesQuery__
 *
 * To run a query within a React component, call `useLatestMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLatestMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLatestMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useLatestMessagesQuery(
  baseOptions?: Apollo.QueryHookOptions<LatestMessagesQuery, LatestMessagesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LatestMessagesQuery, LatestMessagesQueryVariables>(
    LatestMessagesDocument,
    options
  )
}
export function useLatestMessagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LatestMessagesQuery, LatestMessagesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LatestMessagesQuery, LatestMessagesQueryVariables>(
    LatestMessagesDocument,
    options
  )
}
export type LatestMessagesQueryHookResult = ReturnType<typeof useLatestMessagesQuery>
export type LatestMessagesLazyQueryHookResult = ReturnType<typeof useLatestMessagesLazyQuery>
export type LatestMessagesQueryResult = Apollo.QueryResult<
  LatestMessagesQuery,
  LatestMessagesQueryVariables
>
export const MeDocument = gql`
  query Me {
    me {
      ...OwnUserFields
    }
  }
  ${OwnUserFieldsFragmentDoc}
`

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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>
export const SearchUserDocument = gql`
  query SearchUser($userCode: String!) {
    searchUser(userCode: $userCode) {
      ...OtherUserFields
    }
  }
  ${OtherUserFieldsFragmentDoc}
`

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
export function useSearchUserQuery(
  baseOptions: Apollo.QueryHookOptions<SearchUserQuery, SearchUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options)
}
export function useSearchUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchUserQuery, SearchUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options)
}
export type SearchUserQueryHookResult = ReturnType<typeof useSearchUserQuery>
export type SearchUserLazyQueryHookResult = ReturnType<typeof useSearchUserLazyQuery>
export type SearchUserQueryResult = Apollo.QueryResult<SearchUserQuery, SearchUserQueryVariables>
export const MessageDocument = gql`
  subscription Message($chatTimeFormat: String) {
    messageSubscription {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`

/**
 * __useMessageSubscription__
 *
 * To run a query within a React component, call `useMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageSubscription({
 *   variables: {
 *      chatTimeFormat: // value for 'chatTimeFormat'
 *   },
 * });
 */
export function useMessageSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<MessageSubscription, MessageSubscriptionVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<MessageSubscription, MessageSubscriptionVariables>(
    MessageDocument,
    options
  )
}
export type MessageSubscriptionHookResult = ReturnType<typeof useMessageSubscription>
export type MessageSubscriptionResult = Apollo.SubscriptionResult<MessageSubscription>
