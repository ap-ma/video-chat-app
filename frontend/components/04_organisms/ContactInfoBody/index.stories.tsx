/* eslint-disable import/no-unresolved */
import { contactInfo, latestMessages, me, otherUserId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { toStr } from 'utils/general/helper'
import ContactInfoBody, { ContactInfoBodyProps } from './index'

export default {
  title: '04_organisms/ContactInfoBody',
  component: ContactInfoBody
} as Meta

const Template: Story<ContactInfoBodyProps> = ({ ...props }) => {
  const [contactUserId, setContactUserId] = useState(toStr(otherUserId))
  const state = { contactInfoUserId: { state: contactUserId, setContactInfoUserId: setContactUserId } }
  const query = { me, latestMessages, contactInfo }

  return <ContactInfoBody {...{ ...props, state, query }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
