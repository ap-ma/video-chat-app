import { Meta, Story } from '@storybook/react'
import React from 'react'
import ForgotPasswordCompleteDialog, { ForgotPasswordCompleteDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/ForgotPasswordCompleteDialog',
  component: ForgotPasswordCompleteDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

const Template: Story<ForgotPasswordCompleteDialogProps> = ({ ...props }) => {
  return <ForgotPasswordCompleteDialog {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true
}
