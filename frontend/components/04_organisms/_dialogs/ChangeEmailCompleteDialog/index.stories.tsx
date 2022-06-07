import { Meta, Story } from '@storybook/react'
import React from 'react'
import ChangeEmailCompleteDialog, { ChangeEmailCompleteDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/ChangeEmailCompleteDialog',
  component: ChangeEmailCompleteDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

const Template: Story<ChangeEmailCompleteDialogProps> = ({ ...props }) => {
  return <ChangeEmailCompleteDialog {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true
}
