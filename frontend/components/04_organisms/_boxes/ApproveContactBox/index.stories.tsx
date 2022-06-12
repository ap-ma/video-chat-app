/* eslint-disable import/no-unresolved */
import { dummyContactInfo, dummyMutation, me, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { NetworkStatus } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import { ApproveContactMutation, ApproveContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import ApproveContactBox, { ApproveContactBoxProps } from './index'

export default {
  title: '04_organisms/boxes/ApproveContactBox',
  component: ApproveContactBox
} as Meta

type ApproveContactBoxStoryProps = ApproveContactBoxProps & {
  loading: MutaionLoading
}

const Template: Story<ApproveContactBoxStoryProps> = ({ loading, ...props }) => {
  // query
  const contactInfo = dummyContactInfo(
    userId,
    otherUserId,
    CONTACT.STATUS.UNAPPROVED,
    false,
    50,
    (i) => `chat message${i}`,
    false,
    NetworkStatus.ready
  )
  const query = { me, contactInfo }

  // mutation
  const approveContact = dummyMutation<
    ApproveContactMutation['approveContact'],
    ApproveContactMutation,
    ApproveContactMutationVariables
  >('ApproveContact', undefined, loading)
  const mutation = { approveContact }

  return <ApproveContactBox {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  loading: false
}
