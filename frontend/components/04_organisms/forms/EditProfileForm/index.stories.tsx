/* eslint-disable import/no-unresolved */
import { dummyMutation, me } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { EditProfileMutation, EditProfileMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import EditProfileForm, { EditProfileFormProps } from './index'

export default {
  title: '04_organisms/forms/EditProfileForm',
  component: EditProfileForm
} as Meta

type EditProfileFormStoryProps = EditProfileFormProps & {
  loading: MutaionLoading
}

const Template: Story<EditProfileFormStoryProps> = ({ loading, ...props }) => {
  const editProfile = dummyMutation<
    EditProfileMutation['editProfile'],
    EditProfileMutation,
    EditProfileMutationVariables
  >('EditProfile', undefined, loading)
  const mutation = { editProfile }
  return <EditProfileForm {...{ ...props, me, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
