/* eslint-disable import/no-unresolved */
import { dummyMutation, signaling } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { CallType, MutaionLoading } from 'types'
import ReceiveCall, { ReceiveCallProps } from './index'

import { CancelMutation, CancelMutationVariables } from 'graphql/generated'

export default {
  title: '04_organisms/ReceiveCall',
  component: ReceiveCall,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type ReceiveCallStoryProps = ReceiveCallProps & {
  loading: MutaionLoading
}

const Template: Story<ReceiveCallStoryProps> = ({ loading, ...props }) => {
  // state
  const [callType, setCallType] = useState<CallType>(CallType.Close)
  const state = { callType: { state: callType, setCallType } }

  // mutation
  const cancel = dummyMutation<CancelMutation['cancel'], CancelMutation, CancelMutationVariables>(
    'Cancel',
    undefined,
    loading
  )
  const mutation = { cancel }

  // subscription
  const subscription = { signaling }

  return <ReceiveCall {...{ ...props, state, mutation, subscription }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
