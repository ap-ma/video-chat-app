/* eslint-disable import/no-unresolved */
import { dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react'
import { SignUpMutation, SignUpMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import SignupForm, { SignupFormProps } from './index'

export default {
  title: '04_organisms/forms/SignupForm',
  component: SignupForm
} as Meta

type SignupFormStoryProps = SignupFormProps & {
  loading: MutaionLoading
}

const Template: Story<SignupFormStoryProps> = ({ loading, ...props }) => {
  const signUp = dummyMutation<SignUpMutation['signUp'], SignUpMutation, SignUpMutationVariables>(
    'SignUp',
    undefined,
    loading
  )
  const mutation = { signUp }
  return <SignupForm {...{ ...props, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
