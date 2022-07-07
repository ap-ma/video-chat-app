import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { IsCalling } from 'types'
import RingUpConfirmDialog, { RingUpConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/RingUpConfirmDialog',
  component: RingUpConfirmDialog,
  argTypes: {
    onCallingOpen: { action: 'clicked' },
    onClose: { action: 'clicked' }
  }
} as Meta

const Template: Story<RingUpConfirmDialogProps> = ({ ...props }) => {
  const [isCalling, setIsCalling] = useState<IsCalling>(false)
  const state = { isCalling: { state: isCalling, setIsCalling } }
  return <RingUpConfirmDialog {...{ ...props, state }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true
}
