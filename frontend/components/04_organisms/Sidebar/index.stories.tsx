/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
import { contactInfo, contacts, latestMessages, me, otherUserId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { toStr } from 'utils/general/helper'
import Sidebar, { SidebarProps } from './index'

export default {
  title: '04_organisms/Sidebar',
  component: Sidebar,
  argTypes: { onCloseButtonClick: { action: 'clicked' } },
  decorators: [(Story) => container({ height: '100%', background: '#f5f5f5' })(Story())]
} as Meta

const Template: Story<SidebarProps> = ({ ...props }) => {
  const [contactUserId, setContactUserId] = useState(toStr(otherUserId))
  const state = { contactInfoUserId: { state: contactUserId, setContactInfoUserId: setContactUserId } }
  const query = { contactInfo }

  return <Sidebar {...props} {...{ me, contacts, latestMessages, state, query }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
