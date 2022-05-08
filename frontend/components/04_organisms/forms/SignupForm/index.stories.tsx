import { Meta, Story } from '@storybook/react'
import React from 'react'
import SignupForm, { SignupFormProps } from './index'

export default {
  title: '04_organisms/forms/SignupForm',
  component: SignupForm,
  argTypes: { signUp: { signUp: { action: 'clicked' } } }
} as Meta

type SignupFormStoryProps = SignupFormProps & {
  loading: SignupFormProps['signUp']['loading']
}

const Template: Story<SignupFormStoryProps> = ({ loading, ...props }) => {
  const signUp = {
    loading,
    reset: () => alert('reset'),
    mutate: () => {
      alert('SignUp')
      return Promise.resolve({ data: undefined, extensions: undefined, context: undefined })
    }
  }
  return <SignupForm {...{ ...props, signUp }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = { onClick: { action: 'clicked' } }
Primary.args = {
  isOpen: true,
  loading: false
}
