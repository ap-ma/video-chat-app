/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
import { contactInfo, dummyMe, dummyMutation, dummySearchUser, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Box } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react'
import {
  ChangeEmailMutation,
  ChangeEmailMutationVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  EditProfileMutation,
  EditProfileMutationVariables,
  SignOutMutation,
  SignOutMutationVariables
} from 'graphql/generated'
import React, { useState } from 'react'
import { ContactInfoUserId, MutaionLoading, QueryLoading } from 'types'
import { toStr } from 'utils/general/helper'
import Header, { HeaderProps } from './index'

export default {
  title: '04_organisms/Header',
  component: Header,
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh' }}>
        <Box pos='absolute' w='18rem' h='100vh' bg='#dcdcdc' d={{ base: 'none', md: 'block' }} />
        {Story()}
      </div>
    ),
    (Story) => container({ height: '100%', background: '#f5f5f5' })(Story())
  ]
} as Meta

type HeaderStoryProps = HeaderProps & {
  meLoading: QueryLoading
  searchUserLoading: QueryLoading
  searchUserResult: boolean
  signOutLoading: MutaionLoading
  editProfileLoading: MutaionLoading
  changeEmailLoading: MutaionLoading
  changePasswordLoading: MutaionLoading
  deleteAccountLoading: MutaionLoading
}

const Template: Story<HeaderStoryProps> = ({
  meLoading,
  searchUserLoading,
  searchUserResult,
  signOutLoading,
  editProfileLoading,
  changeEmailLoading,
  changePasswordLoading,
  deleteAccountLoading,
  ...props
}) => {
  // state
  const [contactUserId, setContactUserId] = useState<ContactInfoUserId>(toStr(otherUserId))
  const state = { contactInfoUserId: { state: contactUserId, setContactInfoUserId: setContactUserId } }

  // query
  const me = dummyMe(userId, meLoading, undefined)
  const searchUser = dummySearchUser(searchUserLoading, searchUserResult)
  const query = { me, contactInfo, searchUser }

  // mutation
  const signOut = dummyMutation<SignOutMutation['signOut'], SignOutMutation, SignOutMutationVariables>(
    'SignOut',
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

  const mutation = { signOut, editProfile, changeEmail, changePassword, deleteAccount }

  return <Header {...{ ...props, state, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  meLoading: false,
  searchUserLoading: false,
  searchUserResult: true,
  signOutLoading: false,
  editProfileLoading: false,
  changePasswordLoading: false,
  deleteAccountLoading: false
}
