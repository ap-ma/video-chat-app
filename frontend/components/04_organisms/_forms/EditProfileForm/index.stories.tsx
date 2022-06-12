/* eslint-disable import/no-unresolved */
import { dummyMutation, me } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
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
  result: boolean
}

const Template: Story<EditProfileFormStoryProps> = ({ loading, result, ...props }) => {
  // query
  const query = { me }

  // mutation
  const mutateResult: EditProfileMutation['editProfile'] | undefined = result
    ? { __typename: 'User', email: '', id: '', code: '' }
    : undefined

  const editProfile = dummyMutation<
    EditProfileMutation['editProfile'],
    EditProfileMutation,
    EditProfileMutationVariables
  >('EditProfile', mutateResult, loading)

  const mutation = { editProfile }

  return <EditProfileForm {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false,
  result: false
}
