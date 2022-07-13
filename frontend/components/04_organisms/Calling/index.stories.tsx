/* eslint-disable import/no-unresolved */
import { contactInfo, dummyMutation, dummySignaling, iceCandidate, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react'
import {
  CancelMutation,
  CancelMutationVariables,
  HangUpMutation,
  HangUpMutationVariables,
  PickUpMutation,
  PickUpMutationVariables,
  RingUpMutation,
  RingUpMutationVariables,
  SendIceCandidateMutation,
  SendIceCandidateMutationVariables,
  SignalType
} from 'graphql/generated'
import React, { useState } from 'react'
import { CallType, MutaionLoading, SubscriptionLoading } from 'types'
import Calling, { CallingProps } from './index'

export default {
  title: '04_organisms/Calling',
  component: Calling,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type CallingStoryProps = CallingProps & {
  ringUpLoading: MutaionLoading
  pickUpLoading: MutaionLoading
  hangUpLoading: MutaionLoading
  cancelLoading: MutaionLoading
  sendIceCandidateLoading: MutaionLoading
  signalingLoading: SubscriptionLoading
  signalingType: SignalType
}

const Template: Story<CallingStoryProps> = ({
  ringUpLoading,
  pickUpLoading,
  hangUpLoading,
  cancelLoading,
  sendIceCandidateLoading,
  signalingLoading,
  signalingType,
  ...props
}) => {
  // state
  const [callType, setCallType] = useState<CallType>(CallType.Answer)
  const state = { callType: { state: callType, setCallType } }

  // query
  const query = { contactInfo }

  // mutation
  const ringUp = dummyMutation<RingUpMutation['ringUp'], RingUpMutation, RingUpMutationVariables>(
    'RingUp',
    undefined,
    ringUpLoading
  )

  const pickUp = dummyMutation<PickUpMutation['pickUp'], PickUpMutation, PickUpMutationVariables>(
    'PickUp',
    undefined,
    pickUpLoading
  )

  const hangUp = dummyMutation<HangUpMutation['hangUp'], HangUpMutation, HangUpMutationVariables>(
    'HangUp',
    undefined,
    hangUpLoading
  )

  const cancel = dummyMutation<CancelMutation['cancel'], CancelMutation, CancelMutationVariables>(
    'Cancel',
    undefined,
    cancelLoading
  )

  const sendIceCandidate = dummyMutation<
    SendIceCandidateMutation['sendIceCandidate'],
    SendIceCandidateMutation,
    SendIceCandidateMutationVariables
  >('SendIceCandidate', undefined, sendIceCandidateLoading)

  const mutation = {
    ringUp,
    pickUp,
    hangUp,
    cancel,
    sendIceCandidate
  }

  // subscription
  const signaling = dummySignaling(userId, otherUserId, signalingLoading, signalingType)
  const subscription = { signaling, iceCandidate }

  return <Calling {...{ ...props, state, query, mutation, subscription }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  signalingType: {
    options: Object.values(SignalType),
    control: {
      type: 'select',
      labels: Object.fromEntries(Object.entries(SignalType).filter(([key]) => isFinite(Number(key))))
    }
  }
}
Primary.args = {
  isOpen: true,
  ringUpLoading: false,
  pickUpLoading: false,
  hangUpLoading: false,
  cancelLoading: false,
  sendIceCandidateLoading: false,
  signalingLoading: false,
  signalingType: SignalType.Close
}
