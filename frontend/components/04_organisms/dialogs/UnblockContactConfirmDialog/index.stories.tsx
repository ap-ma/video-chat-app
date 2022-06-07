/* eslint-disable import/no-unresolved */
import { contactInfo, dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { UnblockContactMutation, UnblockContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import UnblockContactConfirmDialog, { UnblockContactConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/UnblockContactConfirmDialog',
  component: UnblockContactConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type UnblockContactConfirmDialogStoryProps = UnblockContactConfirmDialogProps & {
  loading: MutaionLoading
}

const Template: Story<UnblockContactConfirmDialogStoryProps> = ({ loading, ...props }) => {
  // query
  const query = { contactInfo }

  // mutation
  const unblockContact = dummyMutation<
    UnblockContactMutation['unblockContact'],
    UnblockContactMutation,
    UnblockContactMutationVariables
  >('UnblockContact', undefined, loading)
  const mutation = { unblockContact }

  return <UnblockContactConfirmDialog {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
