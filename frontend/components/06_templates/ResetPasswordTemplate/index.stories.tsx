/* eslint-disable import/no-unresolved */
import { dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { ResetPasswordMutation, ResetPasswordMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import ResetPasswordTemplate, { ResetPasswordTemplateProps } from './index'

export default {
  title: '06_templates/ResetPasswordTemplate',
  component: ResetPasswordTemplate
} as Meta

type ResetPasswordTemplateStoryProps = ResetPasswordTemplateProps & {
  resetPasswordResult: ResetPasswordMutation['resetPassword']
  resetPasswordLoading: MutaionLoading
}

const Template: Story<ResetPasswordTemplateStoryProps> = ({ resetPasswordResult, resetPasswordLoading, ...props }) => {
  const resetPassword = dummyMutation<
    ResetPasswordMutation['resetPassword'],
    ResetPasswordMutation,
    ResetPasswordMutationVariables
  >('resetPassword', resetPasswordResult, resetPasswordLoading)

  const mutation = { resetPassword }

  return <ResetPasswordTemplate {...{ ...props, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
