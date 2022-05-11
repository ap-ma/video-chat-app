/* eslint-disable import/no-unresolved */
import { dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import {
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables,
  SignInMutation,
  SignInMutationVariables,
  SignUpMutation,
  SignUpMutationVariables
} from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import SigninTemplate, { SigninTemplateProps } from './index'

export default {
  title: '06_templates/SigninTemplate',
  component: SigninTemplate
} as Meta

type SigninTemplateStoryProps = SigninTemplateProps & {
  signUpResult: SignUpMutation['signUp']
  signUpLoading: MutaionLoading
  signInResult: SignInMutation['signIn']
  signInLoading: MutaionLoading
  forgotPasswordResult: ForgotPasswordMutation['forgotPassword']
  forgotPasswordLoading: MutaionLoading
}

const Template: Story<SigninTemplateStoryProps> = ({
  signUpResult,
  signUpLoading,
  signInResult,
  signInLoading,
  forgotPasswordResult,
  forgotPasswordLoading,
  ...props
}) => {
  const signUp = dummyMutation<SignUpMutation['signUp'], SignUpMutation, SignUpMutationVariables>(
    'SignUp',
    signUpResult,
    signUpLoading
  )
  const signIn = dummyMutation<SignInMutation['signIn'], SignInMutation, SignInMutationVariables>(
    'SignIn',
    signInResult,
    signInLoading
  )
  const forgotPassword = dummyMutation<
    ForgotPasswordMutation['forgotPassword'],
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >('ForgotPassword', forgotPasswordResult, forgotPasswordLoading)

  const mutation = {
    signUp,
    signIn,
    forgotPassword
  }

  return <SigninTemplate {...{ ...props, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  signUpResult: false,
  signUpLoading: false,
  signInResult: false,
  signInLoading: false,
  forgotPasswordResult: false,
  forgotPasswordLoading: false
}
