/* eslint-disable import/no-unresolved */
import {
  contacts,
  dummyContactInfo,
  dummyMe,
  dummyMutation,
  dummySearchUser,
  dummySignaling,
  latestMessages,
  otherUserId,
  userId
} from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { NetworkStatus } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import {
  ApplyContactMutation,
  ApplyContactMutationVariables,
  ApproveContactMutation,
  ApproveContactMutationVariables,
  BlockContactMutation,
  BlockContactMutationVariables,
  CancelMutation,
  CancelMutationVariables,
  CandidateMutation,
  CandidateMutationVariables,
  ChangeEmailMutation,
  ChangeEmailMutationVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  DeleteContactMutation,
  DeleteContactMutationVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  EditProfileMutation,
  EditProfileMutationVariables,
  HangUpMutation,
  HangUpMutationVariables,
  PickUpMutation,
  PickUpMutationVariables,
  ReadMessagesMutation,
  ReadMessagesMutationVariables,
  RingUpMutation,
  RingUpMutationVariables,
  SendImageMutation,
  SendImageMutationVariables,
  SendMessageMutation,
  SendMessageMutationVariables,
  SignalType,
  SignOutMutation,
  SignOutMutationVariables,
  UnblockContactMutation,
  UnblockContactMutationVariables,
  UndeleteContactMutation,
  UndeleteContactMutationVariables
} from 'graphql/generated'
import React, { useState } from 'react'
import {
  CallType,
  ContactInfoUserId,
  MutaionLoading,
  QueryLoading,
  QueryNetworkStatus,
  SubscriptionLoading
} from 'types'
import { toStr } from 'utils/general/helper'
import IndexTemplate, { IndexTemplateProps } from './index'

export default {
  title: '06_templates/IndexTemplate',
  component: IndexTemplate
} as Meta

type IndexTemplateStoryProps = IndexTemplateProps & {
  meLoading: QueryLoading
  contactInfoLoading: QueryLoading
  contactIntoNetworkStatus: QueryNetworkStatus
  contactInfoStatus: number
  contactInfoBlocked: boolean
  searchUserLoading: QueryLoading
  searchUserResult: boolean
  signOutLoading: MutaionLoading
  editProfileLoading: MutaionLoading
  changeEmailLoading: MutaionLoading
  changePasswordLoading: MutaionLoading
  deleteAccountLoading: MutaionLoading
  sendMessageLoading: MutaionLoading
  sendImageLoading: MutaionLoading
  ringUpLoading: MutaionLoading
  pickUpLoading: MutaionLoading
  hangUpLoading: MutaionLoading
  cancelLoading: MutaionLoading
  candidateLoading: MutaionLoading
  deleteMessageLoading: MutaionLoading
  readMessagesLoading: MutaionLoading
  applyContactLoading: MutaionLoading
  approveContactLoading: MutaionLoading
  deleteContactLoading: MutaionLoading
  undeleteContactLoading: MutaionLoading
  blockContactLoading: MutaionLoading
  unblockContactLoading: MutaionLoading
  signalingLoading: SubscriptionLoading
  signalingType: SignalType
}

const Template: Story<IndexTemplateStoryProps> = ({
  meLoading,
  contactInfoLoading,
  contactIntoNetworkStatus,
  contactInfoStatus,
  contactInfoBlocked,
  searchUserLoading,
  searchUserResult,
  signOutLoading,
  editProfileLoading,
  changeEmailLoading,
  changePasswordLoading,
  deleteAccountLoading,
  sendMessageLoading,
  sendImageLoading,
  ringUpLoading,
  pickUpLoading,
  hangUpLoading,
  cancelLoading,
  candidateLoading,
  deleteMessageLoading,
  readMessagesLoading,
  applyContactLoading,
  approveContactLoading,
  deleteContactLoading,
  undeleteContactLoading,
  blockContactLoading,
  unblockContactLoading,
  signalingLoading,
  signalingType,
  ...props
}) => {
  // state
  const [contactUserId, setContactUserId] = useState<ContactInfoUserId>(toStr(otherUserId))
  const contactInfoUserId = { state: contactUserId, setContactInfoUserId: setContactUserId }
  const [calling, setCallType] = useState<CallType>(CallType.Close)
  const callType = { state: calling, setCallType }
  const state = { contactInfoUserId, callType }

  // query
  const me = dummyMe(userId, meLoading, undefined)

  const contactInfo = dummyContactInfo(
    userId,
    otherUserId,
    contactInfoStatus,
    contactInfoBlocked,
    50,
    (i) => `chat message${i}`,
    contactInfoLoading,
    contactIntoNetworkStatus
  )

  const searchUser = dummySearchUser(searchUserLoading, searchUserResult)

  const query = {
    me,
    contacts,
    latestMessages,
    contactInfo,
    searchUser
  }

  // mutation
  const signOut = dummyMutation<SignOutMutation['signOut'], SignOutMutation, SignOutMutationVariables>(
    'signOut',
    undefined,
    signOutLoading
  )

  const editProfile = dummyMutation<
    EditProfileMutation['editProfile'],
    EditProfileMutation,
    EditProfileMutationVariables
  >('EditProfile', undefined, editProfileLoading)

  const changeEmail = dummyMutation<
    ChangeEmailMutation['changeEmail'],
    ChangeEmailMutation,
    ChangeEmailMutationVariables
  >('ChangeEmail', undefined, changeEmailLoading)

  const changePassword = dummyMutation<
    ChangePasswordMutation['changePassword'],
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >('ChangePassword', undefined, changePasswordLoading)

  const deleteAccount = dummyMutation<
    DeleteAccountMutation['deleteAccount'],
    DeleteAccountMutation,
    DeleteAccountMutationVariables
  >('DeleteAccount', undefined, deleteAccountLoading)

  const sendMessage = dummyMutation<
    SendMessageMutation['sendMessage'],
    SendMessageMutation,
    SendMessageMutationVariables
  >('SendMessage', undefined, sendMessageLoading)

  const sendImage = dummyMutation<SendImageMutation['sendImage'], SendImageMutation, SendImageMutationVariables>(
    'SendImage',
    undefined,
    sendImageLoading
  )

  const ringUp = dummyMutation<RingUpMutation['ringUp'], RingUpMutation, RingUpMutationVariables>(
    'RingUp',
    undefined,
    ringUpLoading
  )

  const pickUp = dummyMutation<PickUpMutation['pickUp'], PickUpMutation, PickUpMutationVariables>(
    'PickUp',
    undefined,
    pickUpLoading
  )

  const hangUp = dummyMutation<HangUpMutation['hangUp'], HangUpMutation, HangUpMutationVariables>(
    'HangUp',
    undefined,
    hangUpLoading
  )

  const cancel = dummyMutation<CancelMutation['cancel'], CancelMutation, CancelMutationVariables>(
    'Cancel',
    undefined,
    cancelLoading
  )

  const candidate = dummyMutation<CandidateMutation['candidate'], CandidateMutation, CandidateMutationVariables>(
    'Candidate',
    undefined,
    candidateLoading
  )

  const deleteMessage = dummyMutation<
    DeleteMessageMutation['deleteMessage'],
    DeleteMessageMutation,
    DeleteMessageMutationVariables
  >('DeleteMessage', undefined, deleteMessageLoading)

  const readMessages = dummyMutation<
    ReadMessagesMutation['readMessages'],
    ReadMessagesMutation,
    ReadMessagesMutationVariables
  >('ReadMessages', undefined, readMessagesLoading)

  const applyContact = dummyMutation<
    ApplyContactMutation['applyContact'],
    ApplyContactMutation,
    ApplyContactMutationVariables
  >('ApplyContact', undefined, applyContactLoading)

  const approveContact = dummyMutation<
    ApproveContactMutation['approveContact'],
    ApproveContactMutation,
    ApproveContactMutationVariables
  >('ApproveContact', undefined, approveContactLoading)

  const deleteContact = dummyMutation<
    DeleteContactMutation['deleteContact'],
    DeleteContactMutation,
    DeleteContactMutationVariables
  >('DeleteContact', undefined, deleteContactLoading)

  const undeleteContact = dummyMutation<
    UndeleteContactMutation['undeleteContact'],
    UndeleteContactMutation,
    UndeleteContactMutationVariables
  >('UndeleteContact', undefined, undeleteContactLoading)

  const blockContact = dummyMutation<
    BlockContactMutation['blockContact'],
    BlockContactMutation,
    BlockContactMutationVariables
  >('BlockContact', undefined, blockContactLoading)

  const unblockContact = dummyMutation<
    UnblockContactMutation['unblockContact'],
    UnblockContactMutation,
    UnblockContactMutationVariables
  >('UnblockContact', undefined, unblockContactLoading)

  const mutation = {
    signOut,
    editProfile,
    changeEmail,
    changePassword,
    deleteAccount,
    sendMessage,
    sendImage,
    ringUp,
    pickUp,
    hangUp,
    cancel,
    candidate,
    deleteMessage,
    readMessages,
    applyContact,
    approveContact,
    deleteContact,
    undeleteContact,
    blockContact,
    unblockContact
  }

  // subscription
  const signaling = dummySignaling(userId, otherUserId, signalingLoading, signalingType)
  const subscription = { signaling }

  return <IndexTemplate {...{ ...props, state, query, mutation, subscription }} />
}

const contactStatusLabels: Record<number, string> = {}
Object.entries(CONTACT.STATUS).forEach(([key, value]) => {
  contactStatusLabels[value] = key
})

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  contactIntoNetworkStatus: {
    options: Object.values(NetworkStatus),
    control: {
      type: 'select',
      labels: Object.fromEntries(Object.entries(NetworkStatus).filter(([key]) => isFinite(Number(key))))
    }
  },
  contactInfoStatus: {
    options: Object.values(CONTACT.STATUS),
    control: { type: 'select', labels: contactStatusLabels }
  },
  signalingType: {
    options: Object.values(SignalType),
    control: {
      type: 'select',
      labels: Object.fromEntries(Object.entries(SignalType).filter(([key]) => isFinite(Number(key))))
    }
  }
}
Primary.args = {
  meLoading: false,
  contactInfoLoading: false,
  contactIntoNetworkStatus: NetworkStatus.ready,
  contactInfoStatus: CONTACT.STATUS.APPROVED,
  contactInfoBlocked: false,
  searchUserLoading: false,
  searchUserResult: true,
  signOutLoading: false,
  editProfileLoading: false,
  changePasswordLoading: false,
  deleteAccountLoading: false,
  sendMessageLoading: false,
  sendImageLoading: false,
  ringUpLoading: false,
  pickUpLoading: false,
  hangUpLoading: false,
  cancelLoading: false,
  candidateLoading: false,
  deleteMessageLoading: false,
  readMessagesLoading: false,
  applyContactLoading: false,
  approveContactLoading: false,
  deleteContactLoading: false,
  undeleteContactLoading: false,
  blockContactLoading: false,
  unblockContactLoading: false,
  signalingLoading: false,
  signalingType: SignalType.Close
}
