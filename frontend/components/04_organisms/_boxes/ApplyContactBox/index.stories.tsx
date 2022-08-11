/* eslint-disable import/no-unresolved */
import { dummyContactInfo, dummyMutation, otherUserId, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { NetworkStatus } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { CONTACT } from 'const'
import { ApplyContactMutation, ApplyContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import ApplyContactBox, { ApplyContactBoxProps } from './index'

export default {
  title: '04_organisms/boxes/ApplyContactBox',
  component: ApplyContactBox
} as Meta

type ApplyContactBoxStoryProps = ApplyContactBoxProps & {
  loading: MutaionLoading
}

const Template: Story<ApplyContactBoxStoryProps> = ({ loading, ...props }) => {
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
  const query = { contactInfo }

  // mutation
  const applyContact = dummyMutation<
    ApplyContactMutation['applyContact'],
    ApplyContactMutation,
    ApplyContactMutationVariables
  >('ApplyContact', undefined, loading)
  const mutation = { applyContact }

  return <ApplyContactBox {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  loading: false
}
