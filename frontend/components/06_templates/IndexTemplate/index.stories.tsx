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
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import {
  BlockContactMutation,
  BlockContactMutationVariables,
  ChangeEmailMutation,
  ChangeEmailMutationVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  ContactApplicationMutation,
  ContactApplicationMutationVariables,
  ContactApprovalMutation,
  ContactApprovalMutationVariables,
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
  signOutLoading: MutaionLoading
  editProfileLoading: MutaionLoading
  changeEmailLoading: MutaionLoading
  changePasswordLoading: MutaionLoading
  deleteAccountLoading: MutaionLoading
  sendMessageLoading: MutaionLoading
  deleteMessageLoading: MutaionLoading
  readMessagesLoading: MutaionLoading
  contactApplicationLoading: MutaionLoading
  contactApprovalLoading: MutaionLoading
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
  signOutLoading,
  editProfileLoading,
  changeEmailLoading,
  changePasswordLoading,
  deleteAccountLoading,
  sendMessageLoading,
  deleteMessageLoading,
  readMessagesLoading,
  contactApplicationLoading,
  contactApprovalLoading,
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

  const searchUser = dummySearchUser(searchUserLoading, 10, (i) => (i % 3 != 0 ? `status message${i}` : undefined))

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

  const contactApplication = dummyMutation<
    ContactApplicationMutation['contactApplication'],
    ContactApplicationMutation,
    ContactApplicationMutationVariables
  >('ContactApplication', undefined, contactApplicationLoading)

  const contactApproval = dummyMutation<
    ContactApprovalMutation['contactApproval'],
    ContactApprovalMutation,
    ContactApprovalMutationVariables
  >('ContactApproval', undefined, contactApprovalLoading)

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
    deleteMessage,
    readMessages,
    contactApplication,
    contactApproval,
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
    options: [1, 2, 3, 4, 6, 7, 8],
    control: {
      type: 'select',
      labels: {
        1: 'loading',
        2: 'setVariables',
        3: 'fetchMore',
        4: 'refetch',
        6: 'poll',
        7: 'ready',
        8: 'error'
      }
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
  contactIntoNetworkStatus: 7,
  contactInfoStatus: CONTACT.STATUS.APPROVED,
  contactInfoBlocked: false,
  searchUserLoading: false,
  signOutLoading: false,
  editProfileLoading: false,
  changePasswordLoading: false,
  deleteAccountLoading: false,
  sendMessageLoading: false,
  readMessagesLoading: false,
  contactApplicationLoading: false
}
