/* eslint-disable import/no-unresolved */
import { dummyContactInfo, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import React from 'react'
import { QueryLoading } from 'types'
import ContactInfo, { ContactInfoProps } from './index'

export default {
  title: '04_organisms/ContactInfo',
  component: ContactInfo
} as Meta

type ContactInfoStoryProps = ContactInfoProps & {
  loading: QueryLoading
  status: number
  blocked: boolean
}

const Template: Story<ContactInfoStoryProps> = ({ loading, status, blocked, ...props }) => {
  const contactInfo = dummyContactInfo(userId, otherUserId, status, blocked, 50, (i) => `chat message${i}`, loading, 7)
  const query = { contactInfo }

  return <ContactInfo {...{ ...props, query }} />
}

const contactStatusLabels: Record<number, string> = {}
Object.entries(CONTACT.STATUS).forEach(([key, value]) => {
  contactStatusLabels[value] = key
})

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  status: {
    options: Object.values(CONTACT.STATUS),
    control: { type: 'select', labels: contactStatusLabels }
  }
}
Primary.args = {
  loading: false,
  status: CONTACT.STATUS.APPROVED,
  blocked: false
}
