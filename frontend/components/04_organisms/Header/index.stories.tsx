/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
import { dummyMutation, me } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
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
import React from 'react'
import { MutaionLoading } from 'types'
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
  signOutLoading: MutaionLoading
  editProfileLoading: MutaionLoading
  changeEmailLoading: MutaionLoading
  changePasswordLoading: MutaionLoading
  deleteAccountLoading: MutaionLoading
}

const Template: Story<HeaderStoryProps> = ({
  signOutLoading,
  editProfileLoading,
  changeEmailLoading,
  changePasswordLoading,
  deleteAccountLoading,
  ...props
}) => {
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
  return <Header {...{ ...props, me, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  signOutLoading: false,
  editProfileLoading: false,
  changePasswordLoading: false,
  deleteAccountLoading: false
}
