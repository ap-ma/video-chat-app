import { Meta, Story } from '@storybook/react'
import React from 'react'
import SignupCompleteDialog, { SignupCompleteDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/SignupCompleteDialog',
  component: SignupCompleteDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

const Template: Story<SignupCompleteDialogProps> = ({ ...props }) => {
  return <SignupCompleteDialog {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true
}
