/* eslint-disable import/no-unresolved */
import { container, withSytle } from '.storybook/decorators'
import { contactInfo, contacts, otherUserId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { toStr } from 'utils/general/helper'
import ContactList, { ContactListProps } from './index'

export default {
  title: '04_organisms/ContactList',
  component: ContactList,
  decorators: [
    (Story) => withSytle({ height: 'calc(100vh - 40px)' })(Story()),
    (Story) => container({ width: '18rem', background: 'white' })(Story()),
    (Story) => container({ background: '#f5f5f5' })(Story())
  ]
} as Meta

const Template: Story<ContactListProps> = ({ ...props }) => {
  const [contactUserId, setContactUserId] = useState(toStr(otherUserId))
  const state = { contactInfoUserId: { state: contactUserId, setContactInfoUserId: setContactUserId } }
  const query = { contactInfo }

  return <ContactList {...{ ...props, contacts, state, query }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
