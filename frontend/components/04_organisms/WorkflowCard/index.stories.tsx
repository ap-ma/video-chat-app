/* eslint-disable import/no-unresolved */
import { dummyContactInfo, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { NetworkStatus } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import React from 'react'
import { QueryNetworkStatus } from 'types'
import { includes } from 'utils/general/object'
import WorkflowCard, { WorkflowCardProps } from './index'

export default {
  title: '04_organisms/WorkflowCard',
  component: WorkflowCard
} as Meta

type WorkflowCardStoryProps = WorkflowCardProps & {
  contactIntoNetworkStatus: QueryNetworkStatus
  contactInfoStatus: number
  contactInfoBlocked: boolean
}

const Template: Story<WorkflowCardStoryProps> = ({
  contactIntoNetworkStatus,
  contactInfoStatus,
  contactInfoBlocked,
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

  return <WorkflowCard {...{ ...props, query }} />
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
  contactInfoBlocked: false
}
