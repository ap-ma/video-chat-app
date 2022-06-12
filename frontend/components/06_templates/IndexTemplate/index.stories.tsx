/* eslint-disable import/no-unresolved */
import {
  contacts,
  dummyContactInfo,
  dummyMe,
  dummyMutation,
  dummySearchUser,
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
  ReadMessagesMutation,
  ReadMessagesMutationVariables,
  SendImageMutation,
  SendImageMutationVariables,
  SendMessageMutation,
  SendMessageMutationVariables,
  SignOutMutation,
  SignOutMutationVariables,
  UnblockContactMutation,
  UnblockContactMutationVariables,
  UndeleteContactMutation,
  UndeleteContactMutationVariables
} from 'graphql/generated'
import React, { useState } from 'react'
import { MutaionLoading, QueryLoading, QueryNetworkStatus } from 'types'
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
  deleteMessageLoading: MutaionLoading
  readMessagesLoading: MutaionLoading
  applyContactLoading: MutaionLoading
  approveContactLoading: MutaionLoading
  deleteContactLoading: MutaionLoading
  undeleteContactLoading: MutaionLoading
  blockContactLoading: MutaionLoading
  unblockContactLoading: MutaionLoading
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
  deleteMessageLoading,
  readMessagesLoading,
  applyContactLoading,
  approveContactLoading,
  deleteContactLoading,
  undeleteContactLoading,
  blockContactLoading,
  unblockContactLoading,
  ...props
}) => {
  // state
  const [contactUserId, setContactUserId] = useState(toStr(otherUserId))
  const state = { contactInfoUserId: { state: contactUserId, setContactInfoUserId: setContactUserId } }

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
    deleteMessage,
    readMessages,
    applyContact,
    approveContact,
    deleteContact,
    undeleteContact,
    blockContact,
    unblockContact
  }

  return <IndexTemplate {...{ ...props, state, query, mutation }} />
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
  deleteMessageLoading: false,
  readMessagesLoading: false,
  applyContactLoading: false,
  approveContactLoading: false,
  deleteContactLoading: false,
  undeleteContactLoading: false,
  blockContactLoading: false,
  unblockContactLoading: false
}
