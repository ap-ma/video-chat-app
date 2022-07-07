/* eslint-disable import/no-unresolved */
import { dummyMutation, signaling } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { IsCalling, MutaionLoading } from 'types'
import ReceiveCall, { ReceiveCallProps } from './index'

import { CancelMutation, CancelMutationVariables } from 'graphql/generated'

export default {
  title: '04_organisms/ReceiveCall',
  component: ReceiveCall,
  argTypes: {
    onCallingOpen: { action: 'clicked' },
    onClose: { action: 'clicked' }
  }
} as Meta

type ReceiveCallStoryProps = ReceiveCallProps & {
  loading: MutaionLoading
}

const Template: Story<ReceiveCallStoryProps> = ({ loading, ...props }) => {
  // state
  const [isCalling, setIsCalling] = useState<IsCalling>(false)
  const state = { isCalling: { state: isCalling, setIsCalling } }

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
