/* eslint-disable import/no-unresolved */
import { dummyContactInfo, me, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { NetworkStatus } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import React from 'react'
import { QueryNetworkStatus } from 'types'
import { includes } from 'utils/general/object'
import ContactInfo, { ContactInfoProps } from './index'

export default {
  title: '04_organisms/ContactInfo',
  component: ContactInfo
} as Meta

type ContactInfoStoryProps = ContactInfoProps & {
  networkStatus: QueryNetworkStatus
  status: number
  blocked: boolean
}

const Template: Story<ContactInfoStoryProps> = ({ networkStatus, status, blocked, ...props }) => {
  const contactInfo = dummyContactInfo(
    userId,
    otherUserId,
    status,
    blocked,
    50,
    (i) => `chat message${i}`,
    !includes(networkStatus, NetworkStatus.loading, NetworkStatus.fetchMore, NetworkStatus.refetch, NetworkStatus.poll),
    networkStatus
  )
  const query = { me, contactInfo }

  return <ContactInfo {...{ ...props, query }} />
}

const contactStatusLabels: Record<number, string> = {}
Object.entries(CONTACT.STATUS).forEach(([key, value]) => {
  contactStatusLabels[value] = key
})

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  networkStatus: {
    options: Object.values(NetworkStatus),
    control: {
      type: 'select',
      labels: Object.fromEntries(Object.entries(NetworkStatus).filter(([key]) => isFinite(Number(key))))
    }
  },
  status: {
    options: Object.values(CONTACT.STATUS),
    control: { type: 'select', labels: contactStatusLabels }
  }
}
Primary.args = {
  networkStatus: NetworkStatus.ready,
  status: CONTACT.STATUS.APPROVED,
  blocked: false
}
