/* eslint-disable import/no-unresolved */
import { dummyContactInfo, dummyMutation, me, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { NetworkStatus } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import {
  ApplyContactMutation,
  ApplyContactMutationVariables,
  ApproveContactMutation,
  ApproveContactMutationVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  UnblockContactMutation,
  UnblockContactMutationVariables
} from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import ContactInfoBody, { ContactInfoBodyProps } from './index'

export default {
  title: '04_organisms/ContactInfoBody',
  component: ContactInfoBody
} as Meta

type ContactInfoBodyStoryProps = ContactInfoBodyProps & {
  contactInfoStatus: number
  contactInfoBlocked: boolean
  deleteMessageLoading: MutaionLoading
  applyContactLoading: MutaionLoading
  approveContactLoading: MutaionLoading
  unblockContactLoading: MutaionLoading
}

const Template: Story<ContactInfoBodyStoryProps> = ({
  contactInfoStatus,
  contactInfoBlocked,
  deleteMessageLoading,
  applyContactLoading,
  approveContactLoading,
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
    false,
    NetworkStatus.ready
  )
  const query = { me, contactInfo }

  // mutation
  const deleteMessage = dummyMutation<
    DeleteMessageMutation['deleteMessage'],
    DeleteMessageMutation,
    DeleteMessageMutationVariables
  >('DeleteMessage', undefined, deleteMessageLoading)

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

  const unblockContact = dummyMutation<
    UnblockContactMutation['unblockContact'],
    UnblockContactMutation,
    UnblockContactMutationVariables
  >('UnblockContact', undefined, unblockContactLoading)

  const mutation = { deleteMessage, applyContact, approveContact, unblockContact }

  return <ContactInfoBody {...{ ...props, query, mutation }} />
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
  contactInfoStatus: CONTACT.STATUS.APPROVED,
  contactInfoBlocked: false
}
