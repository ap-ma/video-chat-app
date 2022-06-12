/* eslint-disable import/no-unresolved */
import { dummyContactInfo, dummyMutation, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { NetworkStatus } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import { UnblockContactMutation, UnblockContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import UnblockContactBox, { UnblockContactBoxProps } from './index'

export default {
  title: '04_organisms/boxes/UnblockContactBox',
  component: UnblockContactBox
} as Meta

type UnblockContactBoxStoryProps = UnblockContactBoxProps & {
  loading: MutaionLoading
}

const Template: Story<UnblockContactBoxStoryProps> = ({ loading, ...props }) => {
  // query
  const contactInfo = dummyContactInfo(
    userId,
    otherUserId,
    CONTACT.STATUS.UNAPPROVED,
    true,
    50,
    (i) => `chat message${i}`,
    false,
    NetworkStatus.ready
  )
  const query = { contactInfo }

  // mutation
  const unblockContact = dummyMutation<
    UnblockContactMutation['unblockContact'],
    UnblockContactMutation,
    UnblockContactMutationVariables
  >('UnblockContact', undefined, loading)
  const mutation = { unblockContact }

  return <UnblockContactBox {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  loading: false
}
