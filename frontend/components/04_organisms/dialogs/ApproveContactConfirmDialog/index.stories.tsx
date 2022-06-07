/* eslint-disable import/no-unresolved */
import { contactInfo, dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { ApproveContactMutation, ApproveContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import ApproveContactConfirmDialog, { ApproveContactConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/ApproveContactConfirmDialog',
  component: ApproveContactConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type ApproveContactConfirmDialogStoryProps = ApproveContactConfirmDialogProps & {
  loading: MutaionLoading
}

const Template: Story<ApproveContactConfirmDialogStoryProps> = ({ loading, ...props }) => {
  // query
  const query = { contactInfo }

  // mutation
  const approveContact = dummyMutation<
    ApproveContactMutation['approveContact'],
    ApproveContactMutation,
    ApproveContactMutationVariables
  >('ApproveContact', undefined, loading)
  const mutation = { approveContact }

  return <ApproveContactConfirmDialog {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
