/* eslint-disable import/no-unresolved */
import { dummyContactInfo, dummyMutation, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Box } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import {
  ApplyContactMutation,
  ApplyContactMutationVariables,
  ApproveContactMutation,
  ApproveContactMutationVariables,
  BlockContactMutation,
  BlockContactMutationVariables,
  DeleteContactMutation,
  DeleteContactMutationVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  ReadMessagesMutation,
  ReadMessagesMutationVariables,
  SendMessageMutation,
  SendMessageMutationVariables,
  UnblockContactMutation,
  UnblockContactMutationVariables,
  UndeleteContactMutation,
  UndeleteContactMutationVariables
} from 'graphql/generated'
import React from 'react'
import { MutaionLoading, QueryLoading, QueryNetworkStatus } from 'types'
import Main, { MainProps } from './index'

export default {
  title: '04_organisms/Main',
  component: Main,
  decorators: [
    (Story) => (
      <Box minHeight='100vh'>
        <Box h='full' w='72' d={{ base: 'none', md: 'block' }} bg='#f8f8f8' pos='absolute' />
        <Box h='20' ml={{ base: 0, md: 72 }} bg='#e0dcdc' />
        {Story()}
      </Box>
    )
  ]
} as Meta

type MainStoryProps = MainProps & {
  contactInfoLoading: QueryLoading
  contactIntoNetworkStatus: QueryNetworkStatus
  contactInfoStatus: number
  contactInfoBlocked: boolean
  sendMessageLoading: MutaionLoading
  deleteMessageLoading: MutaionLoading
  readMessagesLoading: MutaionLoading
  applyContactLoading: MutaionLoading
  approveContactLoading: MutaionLoading
  deleteContactLoading: MutaionLoading
  undeleteContactLoading: MutaionLoading
  blockContactLoading: MutaionLoading
  unblockContactLoading: MutaionLoading
}

const Template: Story<MainStoryProps> = ({
  contactInfoLoading,
  contactIntoNetworkStatus,
  contactInfoStatus,
  contactInfoBlocked,
  sendMessageLoading,
  deleteMessageLoading,
  readMessagesLoading,
  applyContactLoading,
  approveContactLoading,
  deleteContactLoading,
  undeleteContactLoading,
  blockContactLoading,
  unblockContactLoading,
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

  const query = { contactInfo }

  // mutation
  const sendMessage = dummyMutation<
    SendMessageMutation['sendMessage'],
    SendMessageMutation,
    SendMessageMutationVariables
  >('SendMessage', undefined, sendMessageLoading)

  const deleteMessage = dummyMutation<
    DeleteMessageMutation['deleteMessage'],
    DeleteMessageMutation,
    DeleteMessageMutationVariables
  >('DeleteMessage', undefined, deleteMessageLoading)

  const readMessages = dummyMutation<
    ReadMessagesMutation['readMessages'],
    ReadMessagesMutation,
    ReadMessagesMutationVariables
  >('ReadMessages', undefined, readMessagesLoading)

  const applyContact = dummyMutation<
    ApplyContactMutation['applyContact'],
    ApplyContactMutation,
    ApplyContactMutationVariables
  >('ApplyContact', undefined, applyContactLoading)

  const approveContact = dummyMutation<
    ApproveContactMutation['approveContact'],
    ApproveContactMutation,
    ApproveContactMutationVariables
  >('ApproveContact', undefined, approveContactLoading)

  const deleteContact = dummyMutation<
    DeleteContactMutation['deleteContact'],
    DeleteContactMutation,
    DeleteContactMutationVariables
  >('DeleteContact', undefined, deleteContactLoading)

  const undeleteContact = dummyMutation<
    UndeleteContactMutation['undeleteContact'],
    UndeleteContactMutation,
    UndeleteContactMutationVariables
  >('UndeleteContact', undefined, undeleteContactLoading)

  const blockContact = dummyMutation<
    BlockContactMutation['blockContact'],
    BlockContactMutation,
    BlockContactMutationVariables
  >('BlockContact', undefined, blockContactLoading)

  const unblockContact = dummyMutation<
    UnblockContactMutation['unblockContact'],
    UnblockContactMutation,
    UnblockContactMutationVariables
  >('UnblockContact', undefined, unblockContactLoading)

  const mutation = {
    sendMessage,
    deleteMessage,
    readMessages,
    applyContact,
    approveContact,
    deleteContact,
    undeleteContact,
    blockContact,
    unblockContact
  }

  return <Main {...{ ...props, query, mutation }} />
}

const contactStatusLabels: Record<number, string> = {}
Object.entries(CONTACT.STATUS).forEach(([key, value]) => {
  contactStatusLabels[value] = key
})

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  contactIntoNetworkStatus: {
    options: [1, 2, 3, 4, 6, 7, 8],
    control: {
      type: 'select',
      labels: {
        1: 'loading',
        2: 'setVariables',
        3: 'fetchMore',
        4: 'refetch',
        6: 'poll',
        7: 'ready',
        8: 'error'
      }
    }
  },
  contactInfoStatus: {
    options: Object.values(CONTACT.STATUS),
    control: { type: 'select', labels: contactStatusLabels }
  }
}
Primary.args = {
  contactInfoLoading: false,
  contactIntoNetworkStatus: 7,
  contactInfoStatus: CONTACT.STATUS.APPROVED,
  contactInfoBlocked: false,
  sendMessageLoading: false,
  deleteMessageLoading: false,
  readMessagesLoading: false,
  applyContactLoading: false,
  approveContactLoading: false,
  deleteContactLoading: false,
  undeleteContactLoading: false,
  blockContactLoading: false,
  unblockContactLoading: false
}
