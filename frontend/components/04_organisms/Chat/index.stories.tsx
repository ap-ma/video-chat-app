/* eslint-disable import/no-unresolved */
import { container, withSytle } from '.storybook/decorators'
import { contactInfo, latestMessages, me, otherUserId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { toStr } from 'utils/general/helper'
import Chat, { ChatProps } from './index'

export default {
  title: '04_organisms/Chat',
  component: Chat,
  decorators: [
    (Story) => withSytle({ width: '18rem', height: '100vh', background: 'white' })(Story()),
    (Story) => container({ background: '#f5f5f5' })(Story())
  ]
} as Meta

const Template: Story<ChatProps> = ({ ...props }) => {
  const [contactUserId, setContactUserId] = useState(toStr(otherUserId))
  const state = { contactInfoUserId: { state: contactUserId, setContactInfoUserId: setContactUserId } }
  const query = { me, latestMessages, contactInfo }

  return <Chat {...{ ...props, state, query }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
