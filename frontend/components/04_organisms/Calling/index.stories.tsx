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
  SendIceCandidatesMutation,
  SendIceCandidatesMutationVariables,
  SignalingSubscription,
  SignalType
} from 'graphql/generated'
import React, { useState } from 'react'
import { ApolloClient, CallType, MutaionLoading, SubscriptionLoading } from 'types'
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
  sendIceCandidatesLoading: MutaionLoading
  signalingLoading: SubscriptionLoading
  signalingType: SignalType
}

const Template: Story<CallingStoryProps> = ({
  ringUpLoading,
  pickUpLoading,
  hangUpLoading,
  cancelLoading,
  sendIceCandidatesLoading,
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

  const sendIceCandidates = dummyMutation<
    SendIceCandidatesMutation['sendIceCandidates'],
    SendIceCandidatesMutation,
    SendIceCandidatesMutationVariables
  >('SendIceCandidate', undefined, sendIceCandidatesLoading)

  const mutation = {
    ringUp,
    pickUp,
    hangUp,
    cancel,
    sendIceCandidates
  }

  // subscription
  const signaling = dummySignaling(userId, otherUserId, signalingLoading, signalingType)
  const subscription = { signaling, iceCandidate }

  // apolloClient
  const apolloClient = {
    readFragment: (): SignalingSubscription['signalingSubscription'] => ({ ...signaling.result })
  } as unknown as ApolloClient

  return <Calling {...{ ...props, apolloClient, state, query, mutation, subscription }} />
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
  ringUpLoading: false,
  pickUpLoading: false,
  hangUpLoading: false,
  cancelLoading: false,
  sendIceCandidatesLoading: false,
  signalingLoading: false,
  signalingType: SignalType.Close
}
