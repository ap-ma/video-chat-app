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
  Upload: any
}

export type Call = {
  __typename?: 'Call'
  callTime?: Maybe<Scalars['Int']>
  endedAt?: Maybe<Scalars['String']>
  id: Scalars['ID']
  messageId: Scalars['ID']
  startedAt?: Maybe<Scalars['String']>
  status: Scalars['Int']
}

export type CallEndedAtArgs = {
  format?: InputMaybe<Scalars['String']>
}

export type CallStartedAtArgs = {
  format?: InputMaybe<Scalars['String']>
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
  chatCount: Scalars['Int']
  chatDateCount: Scalars['Int']
  id: Scalars['ID']
  latestMessage?: Maybe<LatestMessage>
  status: Scalars['Int']
  userAvatar?: Maybe<Scalars['String']>
  userCode: Scalars['String']
  userComment?: Maybe<Scalars['String']>
  userId: Scalars['ID']
  userName?: Maybe<Scalars['String']>
}

export type ContactChatArgs = {
  cursor?: InputMaybe<Scalars['ID']>
  limit?: InputMaybe<Scalars['Int']>
}

export type EditProfileInput = {
  avatar?: InputMaybe<Scalars['Upload']>
  code: Scalars['String']
  comment?: InputMaybe<Scalars['String']>
  isAvatarEdited?: InputMaybe<Scalars['Boolean']>
  name: Scalars['String']
}

export type IceCandidate = {
  __typename?: 'IceCandidate'
  callId: Scalars['ID']
  candidates: Array<Scalars['String']>
  rxUserId: Scalars['ID']
  txUserId: Scalars['ID']
}

export type LatestMessage = {
  __typename?: 'LatestMessage'
  call?: Maybe<Call>
  createdAt: Scalars['String']
  message?: Maybe<Scalars['String']>
  messageCategory: Scalars['Int']
  messageId: Scalars['ID']
  messageStatus: Scalars['Int']
  txUserId: Scalars['ID']
  unreadMessageCount: Scalars['Int']
  userAvatar?: Maybe<Scalars['String']>
  userCode: Scalars['String']
  userId: Scalars['ID']
  userName?: Maybe<Scalars['String']>
}

export type LatestMessageCreatedAtArgs = {
  format?: InputMaybe<Scalars['String']>
}

export type Message = {
  __typename?: 'Message'
  call?: Maybe<Call>
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
  applyContact: MessageChanged
  approveContact: MessageChanged
  blockContact: Contact
  cancel: MessageChanged
  changeEmail: Scalars['Boolean']
  changePassword: Scalars['Boolean']
  deleteAccount: Scalars['Boolean']
  deleteContact: Contact
  deleteMessage: MessageChanged
  editProfile: User
  forgotPassword: Scalars['Boolean']
  hangUp: MessageChanged
  pickUp: MessageChanged
  readMessages: MessageChanged
  resetPassword: Scalars['Boolean']
  ringUp: MessageChanged
  sendIceCandidates: Scalars['Boolean']
  sendImage: MessageChanged
  sendMessage: MessageChanged
  signIn: Scalars['Boolean']
  signOut: Scalars['Boolean']
  signUp: Scalars['Boolean']
  unblockContact: Contact
  undeleteContact: Contact
  verifyEmail: Scalars['Boolean']
}

export type MutationApplyContactArgs = {
  otherUserId: Scalars['ID']
}

export type MutationApproveContactArgs = {
  messageId: Scalars['ID']
}

export type MutationBlockContactArgs = {
  contactId: Scalars['ID']
}

export type MutationCancelArgs = {
  callId: Scalars['ID']
}

export type MutationChangeEmailArgs = {
  email: Scalars['String']
}

export type MutationChangePasswordArgs = {
  input: ChangePasswordInput
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

export type MutationForgotPasswordArgs = {
  email: Scalars['String']
}

export type MutationHangUpArgs = {
  callId: Scalars['ID']
}

export type MutationPickUpArgs = {
  input: PickUpInput
}

export type MutationReadMessagesArgs = {
  otherUserId: Scalars['ID']
}

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput
}

export type MutationRingUpArgs = {
  input: RingUpInput
}

export type MutationSendIceCandidatesArgs = {
  input: SendIceCandidatesInput
}

export type MutationSendImageArgs = {
  input: SendImageInput
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

export type MutationVerifyEmailArgs = {
  token?: InputMaybe<Scalars['String']>
}

export enum MutationType {
  Created = 'CREATED',
  Deleted = 'DELETED',
  Updated = 'UPDATED'
}

export type PickUpInput = {
  callId: Scalars['ID']
  sdp: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  contactInfo: Contact
  contacts: Array<Contact>
  isAuthenticated: Scalars['Boolean']
  isPasswordResetTokenValid: Scalars['Boolean']
  latestMessages: Array<LatestMessage>
  me: User
  searchUser?: Maybe<User>
}

export type QueryContactInfoArgs = {
  contactUserId?: InputMaybe<Scalars['ID']>
}

export type QueryIsPasswordResetTokenValidArgs = {
  token?: InputMaybe<Scalars['String']>
}

export type QuerySearchUserArgs = {
  userCode: Scalars['String']
}

export type ResetPasswordInput = {
  password: Scalars['String']
  passwordConfirm: Scalars['String']
  token: Scalars['String']
}

export type RingUpInput = {
  contactId: Scalars['ID']
  sdp: Scalars['String']
}

export type SendIceCandidatesInput = {
  callId: Scalars['ID']
  candidates: Array<Scalars['String']>
  otherUserId: Scalars['ID']
}

export type SendImageInput = {
  contactId: Scalars['ID']
  image: Scalars['Upload']
}

export type SendMessageInput = {
  contactId: Scalars['ID']
  message: Scalars['String']
}

export type SignInInput = {
  email: Scalars['String']
  password: Scalars['String']
  rememberMe?: InputMaybe<Scalars['Boolean']>
}

export type SignUpInput = {
  avatar?: InputMaybe<Scalars['Upload']>
  code: Scalars['String']
  comment?: InputMaybe<Scalars['String']>
  email: Scalars['String']
  name: Scalars['String']
  password: Scalars['String']
  passwordConfirm: Scalars['String']
}

export type Signal = {
  __typename?: 'Signal'
  callId: Scalars['ID']
  rxUserId: Scalars['ID']
  sdp?: Maybe<Scalars['String']>
  signalType: SignalType
  txUserAvatar?: Maybe<Scalars['String']>
  txUserId: Scalars['ID']
  txUserName?: Maybe<Scalars['String']>
}

export enum SignalType {
  Answer = 'ANSWER',
  Cancel = 'CANCEL',
  Close = 'CLOSE',
  Offer = 'OFFER'
}

export type Subscription = {
  __typename?: 'Subscription'
  iceCandidateSubscription: IceCandidate
  messageSubscription: MessageChanged
  signalingSubscription: Signal
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

export type CallFieldsFragment = {
  __typename: 'Call'
  id: string
  messageId: string
  status: number
  startedAt?: string | null
  endedAt?: string | null
  callTime?: number | null
}

export type ContactFieldsFragment = {
  __typename: 'Contact'
  id: string
  userId: string
  userCode: string
  userName?: string | null
  userComment?: string | null
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
  userComment?: string | null
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
    txUserId: string
    messageCategory: number
    message?: string | null
    messageStatus: number
    createdAt: string
    unreadMessageCount: number
    call?: {
      __typename: 'Call'
      id: string
      messageId: string
      status: number
      startedAt?: string | null
      endedAt?: string | null
      callTime?: number | null
    } | null
  } | null
}

export type ContactFieldsWithChatFragment = {
  __typename: 'Contact'
  chatCount: number
  chatDateCount: number
  id: string
  userId: string
  userCode: string
  userName?: string | null
  userComment?: string | null
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
    call?: {
      __typename: 'Call'
      id: string
      messageId: string
      status: number
      startedAt?: string | null
      endedAt?: string | null
      callTime?: number | null
    } | null
  }>
}

export type IceCandidateFieldsFragment = {
  __typename: 'IceCandidate'
  callId: string
  txUserId: string
  rxUserId: string
  candidates: Array<string>
}

export type LatestMessageFieldsFragment = {
  __typename: 'LatestMessage'
  userId: string
  userCode: string
  userName?: string | null
  userAvatar?: string | null
  messageId: string
  txUserId: string
  messageCategory: number
  message?: string | null
  messageStatus: number
  createdAt: string
  unreadMessageCount: number
  call?: {
    __typename: 'Call'
    id: string
    messageId: string
    status: number
    startedAt?: string | null
    endedAt?: string | null
    callTime?: number | null
  } | null
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
    call?: {
      __typename: 'Call'
      id: string
      messageId: string
      status: number
      startedAt?: string | null
      endedAt?: string | null
      callTime?: number | null
    } | null
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
    call?: {
      __typename: 'Call'
      id: string
      messageId: string
      status: number
      startedAt?: string | null
      endedAt?: string | null
      callTime?: number | null
    } | null
  }> | null
  latestMessage?: {
    __typename: 'LatestMessage'
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    messageId: string
    txUserId: string
    messageCategory: number
    message?: string | null
    messageStatus: number
    createdAt: string
    unreadMessageCount: number
    call?: {
      __typename: 'Call'
      id: string
      messageId: string
      status: number
      startedAt?: string | null
      endedAt?: string | null
      callTime?: number | null
    } | null
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
  call?: {
    __typename: 'Call'
    id: string
    messageId: string
    status: number
    startedAt?: string | null
    endedAt?: string | null
    callTime?: number | null
  } | null
}

export type SignalFieldsFragment = {
  __typename: 'Signal'
  callId: string
  txUserId: string
  txUserName?: string | null
  txUserAvatar?: string | null
  rxUserId: string
  sdp?: string | null
  signalType: SignalType
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

export type ApplyContactMutationVariables = Exact<{
  otherUserId: Scalars['ID']
  dateTimeFormat?: InputMaybe<Scalars['String']>
}>

export type ApplyContactMutation = {
  __typename?: 'Mutation'
  applyContact: {
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    } | null
  }
}

export type ApproveContactMutationVariables = Exact<{
  messageId: Scalars['ID']
  dateTimeFormat?: InputMaybe<Scalars['String']>
}>

export type ApproveContactMutation = {
  __typename?: 'Mutation'
  approveContact: {
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    } | null
  }
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
    userComment?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
  }
}

export type CancelMutationVariables = Exact<{
  callId: Scalars['ID']
  dateTimeFormat?: InputMaybe<Scalars['String']>
}>

export type CancelMutation = {
  __typename?: 'Mutation'
  cancel: {
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    } | null
  }
}

export type ChangeEmailMutationVariables = Exact<{
  email: Scalars['String']
}>

export type ChangeEmailMutation = { __typename?: 'Mutation'; changeEmail: boolean }

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput
}>

export type ChangePasswordMutation = { __typename?: 'Mutation'; changePassword: boolean }

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
    userComment?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
  }
}

export type DeleteMessageMutationVariables = Exact<{
  messageId: Scalars['ID']
  dateTimeFormat?: InputMaybe<Scalars['String']>
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']
}>

export type ForgotPasswordMutation = { __typename?: 'Mutation'; forgotPassword: boolean }

export type HangUpMutationVariables = Exact<{
  callId: Scalars['ID']
  dateTimeFormat?: InputMaybe<Scalars['String']>
}>

export type HangUpMutation = {
  __typename?: 'Mutation'
  hangUp: {
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    } | null
  }
}

export type PickUpMutationVariables = Exact<{
  input: PickUpInput
  dateTimeFormat?: InputMaybe<Scalars['String']>
}>

export type PickUpMutation = {
  __typename?: 'Mutation'
  pickUp: {
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    } | null
  }
}

export type ReadMessagesMutationVariables = Exact<{
  otherUserId: Scalars['ID']
  dateTimeFormat?: InputMaybe<Scalars['String']>
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    } | null
  }
}

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput
}>

export type ResetPasswordMutation = { __typename?: 'Mutation'; resetPassword: boolean }

export type RingUpMutationVariables = Exact<{
  input: RingUpInput
  dateTimeFormat?: InputMaybe<Scalars['String']>
}>

export type RingUpMutation = {
  __typename?: 'Mutation'
  ringUp: {
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    } | null
  }
}

export type SendIceCandidatesMutationVariables = Exact<{
  input: SendIceCandidatesInput
}>

export type SendIceCandidatesMutation = { __typename?: 'Mutation'; sendIceCandidates: boolean }

export type SendImageMutationVariables = Exact<{
  input: SendImageInput
  dateTimeFormat?: InputMaybe<Scalars['String']>
}>

export type SendImageMutation = {
  __typename?: 'Mutation'
  sendImage: {
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    } | null
  }
}

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput
  dateTimeFormat?: InputMaybe<Scalars['String']>
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
  dateTimeFormat?: InputMaybe<Scalars['String']>
}>

export type UnblockContactMutation = {
  __typename?: 'Mutation'
  unblockContact: {
    __typename: 'Contact'
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userComment?: string | null
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
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
    userComment?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
  }
}

export type VerifyEmailMutationVariables = Exact<{
  token?: InputMaybe<Scalars['String']>
}>

export type VerifyEmailMutation = { __typename?: 'Mutation'; verifyEmail: boolean }

export type InitQueryVariables = Exact<{
  contactUserId?: InputMaybe<Scalars['ID']>
  cursor?: InputMaybe<Scalars['ID']>
  limit?: InputMaybe<Scalars['Int']>
  dateTimeFormat?: InputMaybe<Scalars['String']>
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
    userComment?: string | null
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
    txUserId: string
    messageCategory: number
    message?: string | null
    messageStatus: number
    createdAt: string
    unreadMessageCount: number
    call?: {
      __typename: 'Call'
      id: string
      messageId: string
      status: number
      startedAt?: string | null
      endedAt?: string | null
      callTime?: number | null
    } | null
  }>
  contactInfo: {
    __typename: 'Contact'
    chatCount: number
    chatDateCount: number
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userComment?: string | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }>
  }
}

export type ContactInfoQueryVariables = Exact<{
  contactUserId?: InputMaybe<Scalars['ID']>
  cursor?: InputMaybe<Scalars['ID']>
  limit?: InputMaybe<Scalars['Int']>
  dateTimeFormat?: InputMaybe<Scalars['String']>
}>

export type ContactInfoQuery = {
  __typename?: 'Query'
  contactInfo: {
    __typename: 'Contact'
    chatCount: number
    chatDateCount: number
    id: string
    userId: string
    userCode: string
    userName?: string | null
    userComment?: string | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
    userComment?: string | null
    userAvatar?: string | null
    status: number
    blocked: boolean
  }>
}

export type IsAuthenticatedQueryVariables = Exact<{ [key: string]: never }>

export type IsAuthenticatedQuery = { __typename?: 'Query'; isAuthenticated: boolean }

export type IsPasswordResetTokenValidQueryVariables = Exact<{
  token?: InputMaybe<Scalars['String']>
}>

export type IsPasswordResetTokenValidQuery = { __typename?: 'Query'; isPasswordResetTokenValid: boolean }

export type LatestMessagesQueryVariables = Exact<{
  dateTimeFormat?: InputMaybe<Scalars['String']>
}>

export type LatestMessagesQuery = {
  __typename?: 'Query'
  latestMessages: Array<{
    __typename: 'LatestMessage'
    userId: string
    userCode: string
    userName?: string | null
    userAvatar?: string | null
    messageId: string
    txUserId: string
    messageCategory: number
    message?: string | null
    messageStatus: number
    createdAt: string
    unreadMessageCount: number
    call?: {
      __typename: 'Call'
      id: string
      messageId: string
      status: number
      startedAt?: string | null
      endedAt?: string | null
      callTime?: number | null
    } | null
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
  searchUser?: {
    __typename: 'User'
    id: string
    code: string
    name?: string | null
    comment?: string | null
    avatar?: string | null
  } | null
}

export type IceCandidateSubscriptionVariables = Exact<{ [key: string]: never }>

export type IceCandidateSubscription = {
  __typename?: 'Subscription'
  iceCandidateSubscription: {
    __typename: 'IceCandidate'
    callId: string
    txUserId: string
    rxUserId: string
    candidates: Array<string>
  }
}

export type MessageSubscriptionVariables = Exact<{
  dateTimeFormat?: InputMaybe<Scalars['String']>
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
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
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    }> | null
    latestMessage?: {
      __typename: 'LatestMessage'
      userId: string
      userCode: string
      userName?: string | null
      userAvatar?: string | null
      messageId: string
      txUserId: string
      messageCategory: number
      message?: string | null
      messageStatus: number
      createdAt: string
      unreadMessageCount: number
      call?: {
        __typename: 'Call'
        id: string
        messageId: string
        status: number
        startedAt?: string | null
        endedAt?: string | null
        callTime?: number | null
      } | null
    } | null
  }
}

export type SignalingSubscriptionVariables = Exact<{ [key: string]: never }>

export type SignalingSubscription = {
  __typename?: 'Subscription'
  signalingSubscription: {
    __typename: 'Signal'
    callId: string
    txUserId: string
    txUserName?: string | null
    txUserAvatar?: string | null
    rxUserId: string
    sdp?: string | null
    signalType: SignalType
  }
}

export const ContactFieldsFragmentDoc = gql`
  fragment ContactFields on Contact {
    __typename
    id
    userId
    userCode
    userName
    userComment
    userAvatar
    status
    blocked
  }
`
export const CallFieldsFragmentDoc = gql`
  fragment CallFields on Call {
    __typename
    id
    messageId
    status
    startedAt(format: $dateTimeFormat)
    endedAt(format: $dateTimeFormat)
    callTime
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
    txUserId
    messageCategory
    message
    messageStatus
    createdAt(format: $dateTimeFormat)
    unreadMessageCount
    call {
      ...CallFields
    }
  }
  ${CallFieldsFragmentDoc}
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
    createdAt(format: $dateTimeFormat)
    call {
      ...CallFields
    }
  }
  ${CallFieldsFragmentDoc}
`
export const ContactFieldsWithChatFragmentDoc = gql`
  fragment ContactFieldsWithChat on Contact {
    ...ContactFields
    chatCount
    chatDateCount
    chat(cursor: $cursor, limit: $limit) {
      ...MessageFields
    }
  }
  ${ContactFieldsFragmentDoc}
  ${MessageFieldsFragmentDoc}
`
export const IceCandidateFieldsFragmentDoc = gql`
  fragment IceCandidateFields on IceCandidate {
    __typename
    callId
    txUserId
    rxUserId
    candidates
  }
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
export const SignalFieldsFragmentDoc = gql`
  fragment SignalFields on Signal {
    __typename
    callId
    txUserId
    txUserName
    txUserAvatar
    rxUserId
    sdp
    signalType
  }
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
export const ApplyContactDocument = gql`
  mutation ApplyContact($otherUserId: ID!, $dateTimeFormat: String) {
    applyContact(otherUserId: $otherUserId) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type ApplyContactMutationFn = Apollo.MutationFunction<ApplyContactMutation, ApplyContactMutationVariables>

/**
 * __useApplyContactMutation__
 *
 * To run a mutation, you first call `useApplyContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApplyContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [applyContactMutation, { data, loading, error }] = useApplyContactMutation({
 *   variables: {
 *      otherUserId: // value for 'otherUserId'
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useApplyContactMutation(
  baseOptions?: Apollo.MutationHookOptions<ApplyContactMutation, ApplyContactMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ApplyContactMutation, ApplyContactMutationVariables>(ApplyContactDocument, options)
}
export type ApplyContactMutationHookResult = ReturnType<typeof useApplyContactMutation>
export type ApplyContactMutationResult = Apollo.MutationResult<ApplyContactMutation>
export type ApplyContactMutationOptions = Apollo.BaseMutationOptions<
  ApplyContactMutation,
  ApplyContactMutationVariables
>
export const ApproveContactDocument = gql`
  mutation ApproveContact($messageId: ID!, $dateTimeFormat: String) {
    approveContact(messageId: $messageId) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type ApproveContactMutationFn = Apollo.MutationFunction<ApproveContactMutation, ApproveContactMutationVariables>

/**
 * __useApproveContactMutation__
 *
 * To run a mutation, you first call `useApproveContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveContactMutation, { data, loading, error }] = useApproveContactMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useApproveContactMutation(
  baseOptions?: Apollo.MutationHookOptions<ApproveContactMutation, ApproveContactMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ApproveContactMutation, ApproveContactMutationVariables>(ApproveContactDocument, options)
}
export type ApproveContactMutationHookResult = ReturnType<typeof useApproveContactMutation>
export type ApproveContactMutationResult = Apollo.MutationResult<ApproveContactMutation>
export type ApproveContactMutationOptions = Apollo.BaseMutationOptions<
  ApproveContactMutation,
  ApproveContactMutationVariables
>
export const BlockContactDocument = gql`
  mutation BlockContact($contactId: ID!) {
    blockContact(contactId: $contactId) {
      ...ContactFields
    }
  }
  ${ContactFieldsFragmentDoc}
`
export type BlockContactMutationFn = Apollo.MutationFunction<BlockContactMutation, BlockContactMutationVariables>

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
  return Apollo.useMutation<BlockContactMutation, BlockContactMutationVariables>(BlockContactDocument, options)
}
export type BlockContactMutationHookResult = ReturnType<typeof useBlockContactMutation>
export type BlockContactMutationResult = Apollo.MutationResult<BlockContactMutation>
export type BlockContactMutationOptions = Apollo.BaseMutationOptions<
  BlockContactMutation,
  BlockContactMutationVariables
>
export const CancelDocument = gql`
  mutation Cancel($callId: ID!, $dateTimeFormat: String) {
    cancel(callId: $callId) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type CancelMutationFn = Apollo.MutationFunction<CancelMutation, CancelMutationVariables>

/**
 * __useCancelMutation__
 *
 * To run a mutation, you first call `useCancelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelMutation, { data, loading, error }] = useCancelMutation({
 *   variables: {
 *      callId: // value for 'callId'
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useCancelMutation(baseOptions?: Apollo.MutationHookOptions<CancelMutation, CancelMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CancelMutation, CancelMutationVariables>(CancelDocument, options)
}
export type CancelMutationHookResult = ReturnType<typeof useCancelMutation>
export type CancelMutationResult = Apollo.MutationResult<CancelMutation>
export type CancelMutationOptions = Apollo.BaseMutationOptions<CancelMutation, CancelMutationVariables>
export const ChangeEmailDocument = gql`
  mutation ChangeEmail($email: String!) {
    changeEmail(email: $email)
  }
`
export type ChangeEmailMutationFn = Apollo.MutationFunction<ChangeEmailMutation, ChangeEmailMutationVariables>

/**
 * __useChangeEmailMutation__
 *
 * To run a mutation, you first call `useChangeEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeEmailMutation, { data, loading, error }] = useChangeEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useChangeEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<ChangeEmailMutation, ChangeEmailMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ChangeEmailMutation, ChangeEmailMutationVariables>(ChangeEmailDocument, options)
}
export type ChangeEmailMutationHookResult = ReturnType<typeof useChangeEmailMutation>
export type ChangeEmailMutationResult = Apollo.MutationResult<ChangeEmailMutation>
export type ChangeEmailMutationOptions = Apollo.BaseMutationOptions<ChangeEmailMutation, ChangeEmailMutationVariables>
export const ChangePasswordDocument = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>

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
  return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options)
}
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>
export const DeleteAccountDocument = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>

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
  return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options)
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
export type DeleteContactMutationFn = Apollo.MutationFunction<DeleteContactMutation, DeleteContactMutationVariables>

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
  return Apollo.useMutation<DeleteContactMutation, DeleteContactMutationVariables>(DeleteContactDocument, options)
}
export type DeleteContactMutationHookResult = ReturnType<typeof useDeleteContactMutation>
export type DeleteContactMutationResult = Apollo.MutationResult<DeleteContactMutation>
export type DeleteContactMutationOptions = Apollo.BaseMutationOptions<
  DeleteContactMutation,
  DeleteContactMutationVariables
>
export const DeleteMessageDocument = gql`
  mutation DeleteMessage($messageId: ID!, $dateTimeFormat: String) {
    deleteMessage(messageId: $messageId) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type DeleteMessageMutationFn = Apollo.MutationFunction<DeleteMessageMutation, DeleteMessageMutationVariables>

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
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useDeleteMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, options)
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
export type EditProfileMutationFn = Apollo.MutationFunction<EditProfileMutation, EditProfileMutationVariables>

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
  return Apollo.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, options)
}
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>
export type EditProfileMutationResult = Apollo.MutationResult<EditProfileMutation>
export type EditProfileMutationOptions = Apollo.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options)
}
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>
export const HangUpDocument = gql`
  mutation HangUp($callId: ID!, $dateTimeFormat: String) {
    hangUp(callId: $callId) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type HangUpMutationFn = Apollo.MutationFunction<HangUpMutation, HangUpMutationVariables>

/**
 * __useHangUpMutation__
 *
 * To run a mutation, you first call `useHangUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useHangUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [hangUpMutation, { data, loading, error }] = useHangUpMutation({
 *   variables: {
 *      callId: // value for 'callId'
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useHangUpMutation(baseOptions?: Apollo.MutationHookOptions<HangUpMutation, HangUpMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<HangUpMutation, HangUpMutationVariables>(HangUpDocument, options)
}
export type HangUpMutationHookResult = ReturnType<typeof useHangUpMutation>
export type HangUpMutationResult = Apollo.MutationResult<HangUpMutation>
export type HangUpMutationOptions = Apollo.BaseMutationOptions<HangUpMutation, HangUpMutationVariables>
export const PickUpDocument = gql`
  mutation PickUp($input: PickUpInput!, $dateTimeFormat: String) {
    pickUp(input: $input) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type PickUpMutationFn = Apollo.MutationFunction<PickUpMutation, PickUpMutationVariables>

/**
 * __usePickUpMutation__
 *
 * To run a mutation, you first call `usePickUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePickUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pickUpMutation, { data, loading, error }] = usePickUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function usePickUpMutation(baseOptions?: Apollo.MutationHookOptions<PickUpMutation, PickUpMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<PickUpMutation, PickUpMutationVariables>(PickUpDocument, options)
}
export type PickUpMutationHookResult = ReturnType<typeof usePickUpMutation>
export type PickUpMutationResult = Apollo.MutationResult<PickUpMutation>
export type PickUpMutationOptions = Apollo.BaseMutationOptions<PickUpMutation, PickUpMutationVariables>
export const ReadMessagesDocument = gql`
  mutation ReadMessages($otherUserId: ID!, $dateTimeFormat: String) {
    readMessages(otherUserId: $otherUserId) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type ReadMessagesMutationFn = Apollo.MutationFunction<ReadMessagesMutation, ReadMessagesMutationVariables>

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
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useReadMessagesMutation(
  baseOptions?: Apollo.MutationHookOptions<ReadMessagesMutation, ReadMessagesMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ReadMessagesMutation, ReadMessagesMutationVariables>(ReadMessagesDocument, options)
}
export type ReadMessagesMutationHookResult = ReturnType<typeof useReadMessagesMutation>
export type ReadMessagesMutationResult = Apollo.MutationResult<ReadMessagesMutation>
export type ReadMessagesMutationOptions = Apollo.BaseMutationOptions<
  ReadMessagesMutation,
  ReadMessagesMutationVariables
>
export const ResetPasswordDocument = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useResetPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options)
}
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<
  ResetPasswordMutation,
  ResetPasswordMutationVariables
>
export const RingUpDocument = gql`
  mutation RingUp($input: RingUpInput!, $dateTimeFormat: String) {
    ringUp(input: $input) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type RingUpMutationFn = Apollo.MutationFunction<RingUpMutation, RingUpMutationVariables>

/**
 * __useRingUpMutation__
 *
 * To run a mutation, you first call `useRingUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRingUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ringUpMutation, { data, loading, error }] = useRingUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useRingUpMutation(baseOptions?: Apollo.MutationHookOptions<RingUpMutation, RingUpMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RingUpMutation, RingUpMutationVariables>(RingUpDocument, options)
}
export type RingUpMutationHookResult = ReturnType<typeof useRingUpMutation>
export type RingUpMutationResult = Apollo.MutationResult<RingUpMutation>
export type RingUpMutationOptions = Apollo.BaseMutationOptions<RingUpMutation, RingUpMutationVariables>
export const SendIceCandidatesDocument = gql`
  mutation SendIceCandidates($input: SendIceCandidatesInput!) {
    sendIceCandidates(input: $input)
  }
`
export type SendIceCandidatesMutationFn = Apollo.MutationFunction<
  SendIceCandidatesMutation,
  SendIceCandidatesMutationVariables
>

/**
 * __useSendIceCandidatesMutation__
 *
 * To run a mutation, you first call `useSendIceCandidatesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendIceCandidatesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendIceCandidatesMutation, { data, loading, error }] = useSendIceCandidatesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendIceCandidatesMutation(
  baseOptions?: Apollo.MutationHookOptions<SendIceCandidatesMutation, SendIceCandidatesMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SendIceCandidatesMutation, SendIceCandidatesMutationVariables>(
    SendIceCandidatesDocument,
    options
  )
}
export type SendIceCandidatesMutationHookResult = ReturnType<typeof useSendIceCandidatesMutation>
export type SendIceCandidatesMutationResult = Apollo.MutationResult<SendIceCandidatesMutation>
export type SendIceCandidatesMutationOptions = Apollo.BaseMutationOptions<
  SendIceCandidatesMutation,
  SendIceCandidatesMutationVariables
>
export const SendImageDocument = gql`
  mutation SendImage($input: SendImageInput!, $dateTimeFormat: String) {
    sendImage(input: $input) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type SendImageMutationFn = Apollo.MutationFunction<SendImageMutation, SendImageMutationVariables>

/**
 * __useSendImageMutation__
 *
 * To run a mutation, you first call `useSendImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendImageMutation, { data, loading, error }] = useSendImageMutation({
 *   variables: {
 *      input: // value for 'input'
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useSendImageMutation(
  baseOptions?: Apollo.MutationHookOptions<SendImageMutation, SendImageMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SendImageMutation, SendImageMutationVariables>(SendImageDocument, options)
}
export type SendImageMutationHookResult = ReturnType<typeof useSendImageMutation>
export type SendImageMutationResult = Apollo.MutationResult<SendImageMutation>
export type SendImageMutationOptions = Apollo.BaseMutationOptions<SendImageMutation, SendImageMutationVariables>
export const SendMessageDocument = gql`
  mutation SendMessage($input: SendMessageInput!, $dateTimeFormat: String) {
    sendMessage(input: $input) {
      ...MessageChangedFields
    }
  }
  ${MessageChangedFieldsFragmentDoc}
`
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>

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
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useSendMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options)
}
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>
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
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options)
}
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>
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
export type SignOutMutationOptions = Apollo.BaseMutationOptions<SignOutMutation, SignOutMutationVariables>
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
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options)
}
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>
export const UnblockContactDocument = gql`
  mutation UnblockContact($contactId: ID!, $dateTimeFormat: String) {
    unblockContact(contactId: $contactId) {
      ...ContactFieldsWithLatestMessage
    }
  }
  ${ContactFieldsWithLatestMessageFragmentDoc}
`
export type UnblockContactMutationFn = Apollo.MutationFunction<UnblockContactMutation, UnblockContactMutationVariables>

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
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useUnblockContactMutation(
  baseOptions?: Apollo.MutationHookOptions<UnblockContactMutation, UnblockContactMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UnblockContactMutation, UnblockContactMutationVariables>(UnblockContactDocument, options)
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
  baseOptions?: Apollo.MutationHookOptions<UndeleteContactMutation, UndeleteContactMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UndeleteContactMutation, UndeleteContactMutationVariables>(UndeleteContactDocument, options)
}
export type UndeleteContactMutationHookResult = ReturnType<typeof useUndeleteContactMutation>
export type UndeleteContactMutationResult = Apollo.MutationResult<UndeleteContactMutation>
export type UndeleteContactMutationOptions = Apollo.BaseMutationOptions<
  UndeleteContactMutation,
  UndeleteContactMutationVariables
>
export const VerifyEmailDocument = gql`
  mutation VerifyEmail($token: String) {
    verifyEmail(token: $token)
  }
`
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options)
}
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>
export const InitDocument = gql`
  query Init($contactUserId: ID, $cursor: ID, $limit: Int, $dateTimeFormat: String) {
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
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useInitQuery(baseOptions?: Apollo.QueryHookOptions<InitQuery, InitQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<InitQuery, InitQueryVariables>(InitDocument, options)
}
export function useInitLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InitQuery, InitQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<InitQuery, InitQueryVariables>(InitDocument, options)
}
export type InitQueryHookResult = ReturnType<typeof useInitQuery>
export type InitLazyQueryHookResult = ReturnType<typeof useInitLazyQuery>
export type InitQueryResult = Apollo.QueryResult<InitQuery, InitQueryVariables>
export const ContactInfoDocument = gql`
  query ContactInfo($contactUserId: ID, $cursor: ID, $limit: Int, $dateTimeFormat: String) {
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
 *      dateTimeFormat: // value for 'dateTimeFormat'
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
  return Apollo.useLazyQuery<ContactInfoQuery, ContactInfoQueryVariables>(ContactInfoDocument, options)
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
export function useContactsQuery(baseOptions?: Apollo.QueryHookOptions<ContactsQuery, ContactsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ContactsQuery, ContactsQueryVariables>(ContactsDocument, options)
}
export function useContactsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ContactsQuery, ContactsQueryVariables>) {
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
  return Apollo.useQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(IsAuthenticatedDocument, options)
}
export function useIsAuthenticatedLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>(IsAuthenticatedDocument, options)
}
export type IsAuthenticatedQueryHookResult = ReturnType<typeof useIsAuthenticatedQuery>
export type IsAuthenticatedLazyQueryHookResult = ReturnType<typeof useIsAuthenticatedLazyQuery>
export type IsAuthenticatedQueryResult = Apollo.QueryResult<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>
export const IsPasswordResetTokenValidDocument = gql`
  query IsPasswordResetTokenValid($token: String) {
    isPasswordResetTokenValid(token: $token)
  }
`

/**
 * __useIsPasswordResetTokenValidQuery__
 *
 * To run a query within a React component, call `useIsPasswordResetTokenValidQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsPasswordResetTokenValidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsPasswordResetTokenValidQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useIsPasswordResetTokenValidQuery(
  baseOptions?: Apollo.QueryHookOptions<IsPasswordResetTokenValidQuery, IsPasswordResetTokenValidQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<IsPasswordResetTokenValidQuery, IsPasswordResetTokenValidQueryVariables>(
    IsPasswordResetTokenValidDocument,
    options
  )
}
export function useIsPasswordResetTokenValidLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<IsPasswordResetTokenValidQuery, IsPasswordResetTokenValidQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<IsPasswordResetTokenValidQuery, IsPasswordResetTokenValidQueryVariables>(
    IsPasswordResetTokenValidDocument,
    options
  )
}
export type IsPasswordResetTokenValidQueryHookResult = ReturnType<typeof useIsPasswordResetTokenValidQuery>
export type IsPasswordResetTokenValidLazyQueryHookResult = ReturnType<typeof useIsPasswordResetTokenValidLazyQuery>
export type IsPasswordResetTokenValidQueryResult = Apollo.QueryResult<
  IsPasswordResetTokenValidQuery,
  IsPasswordResetTokenValidQueryVariables
>
export const LatestMessagesDocument = gql`
  query LatestMessages($dateTimeFormat: String) {
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
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useLatestMessagesQuery(
  baseOptions?: Apollo.QueryHookOptions<LatestMessagesQuery, LatestMessagesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LatestMessagesQuery, LatestMessagesQueryVariables>(LatestMessagesDocument, options)
}
export function useLatestMessagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LatestMessagesQuery, LatestMessagesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LatestMessagesQuery, LatestMessagesQueryVariables>(LatestMessagesDocument, options)
}
export type LatestMessagesQueryHookResult = ReturnType<typeof useLatestMessagesQuery>
export type LatestMessagesLazyQueryHookResult = ReturnType<typeof useLatestMessagesLazyQuery>
export type LatestMessagesQueryResult = Apollo.QueryResult<LatestMessagesQuery, LatestMessagesQueryVariables>
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
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
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
export function useSearchUserQuery(baseOptions: Apollo.QueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
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
export const IceCandidateDocument = gql`
  subscription IceCandidate {
    iceCandidateSubscription {
      ...IceCandidateFields
    }
  }
  ${IceCandidateFieldsFragmentDoc}
`

/**
 * __useIceCandidateSubscription__
 *
 * To run a query within a React component, call `useIceCandidateSubscription` and pass it any options that fit your needs.
 * When your component renders, `useIceCandidateSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIceCandidateSubscription({
 *   variables: {
 *   },
 * });
 */
export function useIceCandidateSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<IceCandidateSubscription, IceCandidateSubscriptionVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<IceCandidateSubscription, IceCandidateSubscriptionVariables>(
    IceCandidateDocument,
    options
  )
}
export type IceCandidateSubscriptionHookResult = ReturnType<typeof useIceCandidateSubscription>
export type IceCandidateSubscriptionResult = Apollo.SubscriptionResult<IceCandidateSubscription>
export const MessageDocument = gql`
  subscription Message($dateTimeFormat: String) {
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
 *      dateTimeFormat: // value for 'dateTimeFormat'
 *   },
 * });
 */
export function useMessageSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<MessageSubscription, MessageSubscriptionVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<MessageSubscription, MessageSubscriptionVariables>(MessageDocument, options)
}
export type MessageSubscriptionHookResult = ReturnType<typeof useMessageSubscription>
export type MessageSubscriptionResult = Apollo.SubscriptionResult<MessageSubscription>
export const SignalingDocument = gql`
  subscription Signaling {
    signalingSubscription {
      ...SignalFields
    }
  }
  ${SignalFieldsFragmentDoc}
`

/**
 * __useSignalingSubscription__
 *
 * To run a query within a React component, call `useSignalingSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSignalingSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSignalingSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSignalingSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<SignalingSubscription, SignalingSubscriptionVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<SignalingSubscription, SignalingSubscriptionVariables>(SignalingDocument, options)
}
export type SignalingSubscriptionHookResult = ReturnType<typeof useSignalingSubscription>
export type SignalingSubscriptionResult = Apollo.SubscriptionResult<SignalingSubscription>
