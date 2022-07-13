import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { CallType } from 'types'
import RingUpConfirmDialog, { RingUpConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/RingUpConfirmDialog',
  component: RingUpConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

const Template: Story<RingUpConfirmDialogProps> = ({ ...props }) => {
  const [callType, setCallType] = useState<CallType>(CallType.Close)
  const state = { callType: { state: callType, setCallType } }
  return <RingUpConfirmDialog {...{ ...props, state }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true
}
