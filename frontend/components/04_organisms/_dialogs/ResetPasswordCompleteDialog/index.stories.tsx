import { Meta, Story } from '@storybook/react'
import React from 'react'
import ResetPasswordCompleteDialog, { ResetPasswordCompleteDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/ResetPasswordCompleteDialog',
  component: ResetPasswordCompleteDialog
} as Meta

const Template: Story<ResetPasswordCompleteDialogProps> = ({ ...props }) => {
  return <ResetPasswordCompleteDialog {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true
}
