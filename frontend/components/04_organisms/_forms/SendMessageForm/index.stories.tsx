/* eslint-disable import/no-unresolved */
import { dummyContactInfo, dummyMutation, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { NetworkStatus } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import {
  SendImageMutation,
  SendImageMutationVariables,
  SendMessageMutation,
  SendMessageMutationVariables
} from 'graphql/generated'
import React from 'react'
import { MutaionLoading, QueryNetworkStatus } from 'types'
import { includes } from 'utils/general/object'
import SendMessageForm, { SendMessageFormProps } from './index'

export default {
  title: '04_organisms/forms/SendMessageForm',
  component: SendMessageForm
} as Meta

type SendMessageFormStoryProps = SendMessageFormProps & {
  contactIntoNetworkStatus: QueryNetworkStatus
  contactInfoStatus: number
  contactInfoBlocked: boolean
  sendMessageLoading: MutaionLoading
  sendImageLoading: MutaionLoading
}

const Template: Story<SendMessageFormStoryProps> = ({
  contactIntoNetworkStatus,
  contactInfoStatus,
  contactInfoBlocked,
  sendMessageLoading,
  sendImageLoading,
  ...props
}) => {
  // query
  const contactInfo = dummyContactInfo(
    userId,
    otherUserId,
    contactInfoStatus,
    contactInfoBlocked,
    50,
    (i) => `chat message${i}`,
    !includes(
      contactIntoNetworkStatus,
      NetworkStatus.loading,
      NetworkStatus.fetchMore,
      NetworkStatus.refetch,
      NetworkStatus.poll
    ),
    contactIntoNetworkStatus
  )
  const query = { contactInfo }

  // mutation
  const sendMessage = dummyMutation<
    SendMessageMutation['sendMessage'],
    SendMessageMutation,
    SendMessageMutationVariables
  >('SendMessage', undefined, sendMessageLoading)

  const sendImage = dummyMutation<SendImageMutation['sendImage'], SendImageMutation, SendImageMutationVariables>(
    'SendImage',
    undefined,
    sendImageLoading
  )

  const mutation = {
    sendMessage,
    sendImage
  }

  return <SendMessageForm {...{ ...props, query, mutation }} />
}

const contactStatusLabels: Record<number, string> = {}
Object.entries(CONTACT.STATUS).forEach(([key, value]) => {
  contactStatusLabels[value] = key
})

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  contactIntoNetworkStatus: {
    options: Object.values(NetworkStatus),
    control: {
      type: 'select',
      labels: Object.fromEntries(Object.entries(NetworkStatus).filter(([key]) => isFinite(Number(key))))
    }
  },
  contactInfoStatus: {
    options: Object.values(CONTACT.STATUS),
    control: { type: 'select', labels: contactStatusLabels }
  }
}
Primary.args = {
  contactIntoNetworkStatus: NetworkStatus.ready,
  contactInfoStatus: CONTACT.STATUS.APPROVED,
  contactInfoBlocked: false,
  sendMessageLoading: false,
  sendImageLoading: false
}
