/* eslint-disable import/no-unresolved */
import { contactInfo, dummyMutation, me, otherUserId, userId } from '.storybook/dummies'
import { Meta, Story } from '@storybook/react'
import { CALL, MESSAGE } from 'const'
import {
  Call as CallModel,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  Message as MessageModel
} from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import { toStr } from 'utils/general/helper'
import Message, { MessageProps } from './index'

export default {
  title: '04_organisms/Message',
  component: Message
} as Meta

type MessageStoryProps = MessageProps & {
  isSender: boolean
  category: MessageModel['category']
  messageContent: MessageModel['message']
  messageStatus: MessageModel['status']
  createdAt: MessageModel['createdAt']
  callStatus: CallModel['status']
  deleteMessageLoading: MutaionLoading
}

const Template: Story<MessageStoryProps> = ({
  isSender,
  category,
  messageContent,
  messageStatus,
  createdAt,
  callStatus,
  deleteMessageLoading,
  ...props
}) => {
  const message = {
    __typename: 'Message',
    id: toStr(1),
    txUserId: isSender ? toStr(userId) : toStr(otherUserId),
    rxUserId: isSender ? toStr(otherUserId) : toStr(userId),
    category,
    message: messageContent,
    status: messageStatus,
    createdAt: createdAt,
    call: {
      __typename: 'Call',
      id: toStr(1),
      messageId: toStr(1),
      status: callStatus,
      startedAt: '06/24/2022 18:10:14',
      endedAt: '06/24/2022 18:40:14',
      callTime: 30
    }
  } as const

  // query
  const query = { me, contactInfo }

  // mutation
  const deleteMessage = dummyMutation<
    DeleteMessageMutation['deleteMessage'],
    DeleteMessageMutation,
    DeleteMessageMutationVariables
  >('DeleteMessage', undefined, deleteMessageLoading)

  const mutation = { deleteMessage }

  return <Message {...{ ...props, message, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  category: {
    options: Object.values(MESSAGE.CATEGORY),
    control: {
      type: 'select',
      labels: Object.fromEntries(Object.entries(MESSAGE.CATEGORY).map(([key, value]) => [value, key]))
    }
  },
  messageStatus: {
    options: Object.values(MESSAGE.STATUS),
    control: {
      type: 'select',
      labels: Object.fromEntries(Object.entries(MESSAGE.STATUS).map(([key, value]) => [value, key]))
    }
  },
  callStatus: {
    options: Object.values(CALL.STATUS),
    control: {
      type: 'select',
      labels: Object.fromEntries(Object.entries(CALL.STATUS).map(([key, value]) => [value, key]))
    }
  }
}
Primary.args = {
  isSender: false,
  category: MESSAGE.CATEGORY.MESSAGE,
  messageContent: 'テキストメッセージ',
  messageStatus: MESSAGE.STATUS.READ,
  createdAt: '06/24/2022 18:40:14',
  callStatus: CALL.STATUS.ENDED,
  deleteMessageLoading: false
}
