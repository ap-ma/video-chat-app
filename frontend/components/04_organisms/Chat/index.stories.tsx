/* eslint-disable import/no-unresolved */
import { dummyContactInfo, dummyMutation, me, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { NetworkStatus } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import { DeleteMessageMutation, DeleteMessageMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading, QueryLoading, QueryNetworkStatus } from 'types'
import Chat, { ChatProps } from './index'

export default {
  title: '04_organisms/Chat',
  component: Chat
} as Meta

type ChatStoryProps = ChatProps & {
  contactInfoLoading: QueryLoading
  contactIntoNetworkStatus: QueryNetworkStatus
  contactInfoStatus: number
  contactInfoBlocked: boolean
  deleteMessageLoading: MutaionLoading
}

const Template: Story<ChatStoryProps> = ({
  contactInfoLoading,
  contactIntoNetworkStatus,
  contactInfoStatus,
  contactInfoBlocked,
  deleteMessageLoading,
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
    contactInfoLoading,
    contactIntoNetworkStatus
  )

  const query = { me, contactInfo }

  // mutation
  const deleteMessage = dummyMutation<
    DeleteMessageMutation['deleteMessage'],
    DeleteMessageMutation,
    DeleteMessageMutationVariables
  >('DeleteMessage', undefined, deleteMessageLoading)

  const mutation = { deleteMessage }

  return <Chat {...{ ...props, query, mutation }} />
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
  contactInfoLoading: false,
  contactIntoNetworkStatus: NetworkStatus.ready,
  contactInfoStatus: CONTACT.STATUS.APPROVED,
  contactInfoBlocked: false,
  deleteMessageLoading: false
}
