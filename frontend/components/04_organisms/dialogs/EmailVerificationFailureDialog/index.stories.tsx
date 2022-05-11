import { Meta, Story } from '@storybook/react'
import React from 'react'
import EmailVerificationFailureDialog, { EmailVerificationFailureDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/EmailVerificationFailureDialog',
  component: EmailVerificationFailureDialog
} as Meta

const Template: Story<EmailVerificationFailureDialogProps> = ({ ...props }) => {
  return <EmailVerificationFailureDialog {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true
}
