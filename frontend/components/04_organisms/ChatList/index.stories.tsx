/* eslint-disable import/no-unresolved */
import { container, withSytle } from '.storybook/decorators'
import { dummyContactInfo, dummyLatestMessages } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import ChatList, { ChatListProps } from './index'

export default {
  title: '04_organisms/ChatList',
  component: ChatList,
  decorators: [
    (Story) => withSytle({ width: '18rem', height: '100vh' })(Story()),
    (Story) => container({ background: '#f5f5f5' })(Story())
  ]
} as Meta

const Template: Story<ChatListProps> = ({ ...props }) => {
  const userId = 0
  const otherUserId = 1

  const [contactUserId, setContactUserId] = useState(otherUserId)
  const latestMessages = dummyLatestMessages(100, (i) => `latest message${i}. I would like to reiterate`)
  const contactInfo = dummyContactInfo(userId, otherUserId, false, 7, 2, false, 50, (i) => `chat message${i}`)
  const query = { contactInfo }
  return <ChatList {...props} {...{ latestMessages, query }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
