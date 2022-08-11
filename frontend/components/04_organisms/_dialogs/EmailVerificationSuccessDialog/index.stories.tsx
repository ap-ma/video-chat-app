import { Meta, Story } from '@storybook/react'
import React from 'react'
import EmailVerificationSuccessDialog, { EmailVerificationSuccessDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/EmailVerificationSuccessDialog',
  component: EmailVerificationSuccessDialog
} as Meta

const Template: Story<EmailVerificationSuccessDialogProps> = ({ ...props }) => {
  return <EmailVerificationSuccessDialog {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true
}
