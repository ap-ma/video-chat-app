/* eslint-disable import/no-unresolved */
import { dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react'
import { ChangePasswordMutation, ChangePasswordMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import ChangePasswordForm, { ChangePasswordFormProps } from './index'

export default {
  title: '04_organisms/forms/ChangePasswordForm',
  component: ChangePasswordForm
} as Meta

type ChangePasswordFormStoryProps = ChangePasswordFormProps & {
  loading: MutaionLoading
}

const Template: Story<ChangePasswordFormStoryProps> = ({ loading, ...props }) => {
  const changePassword = dummyMutation<
    ChangePasswordMutation['changePassword'],
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >('ChangePassword', undefined, loading)
  const mutation = { changePassword }
  return <ChangePasswordForm {...{ ...props, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
