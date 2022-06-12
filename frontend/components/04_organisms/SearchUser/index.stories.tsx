/* eslint-disable import/no-unresolved */
import { contactInfo, dummySearchUser, otherUserId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { MutaionLoading } from 'types'
import { toStr } from 'utils/general/helper'
import SearchUser, { SearchUserProps } from './index'

export default {
  title: '04_organisms/SearchUser',
  component: SearchUser
} as Meta

type SearchUserStoryProps = SearchUserProps & {
  loading: MutaionLoading
  result: boolean
}

const Template: Story<SearchUserStoryProps> = ({ loading, result, ...props }) => {
  // state
  const [contactUserId, setContactUserId] = useState(toStr(otherUserId))
  const state = { contactInfoUserId: { state: contactUserId, setContactInfoUserId: setContactUserId } }

  // query
  const searchUser = dummySearchUser(loading, result)
  const query = { contactInfo, searchUser }

  return <SearchUser {...{ ...props, state, query }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false,
  result: true
}
