import { Meta, Story } from '@storybook/react'
import React from 'react'
import ChangePasswordCompleteDialog, { ChangePasswordCompleteDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/ChangePasswordCompleteDialog',
  component: ChangePasswordCompleteDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

const Template: Story<ChangePasswordCompleteDialogProps> = ({ ...props }) => {
  return <ChangePasswordCompleteDialog {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true
}
