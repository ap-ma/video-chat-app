/* eslint-disable import/no-unresolved */
import { dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react'
import { ForgotPasswordMutation, ForgotPasswordMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import ForgotPasswordForm, { ForgotPasswordFormProps } from './index'

export default {
  title: '04_organisms/forms/ForgotPasswordForm',
  component: ForgotPasswordForm
} as Meta

type ForgotPasswordFormStoryProps = ForgotPasswordFormProps & {
  loading: MutaionLoading
}

const Template: Story<ForgotPasswordFormStoryProps> = ({ loading, ...props }) => {
  const forgotPassword = dummyMutation<
    ForgotPasswordMutation['forgotPassword'],
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >('ForgotPassword', undefined, loading)
  const mutation = { forgotPassword }
  return <ForgotPasswordForm {...{ ...props, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
