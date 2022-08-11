/* eslint-disable import/no-unresolved */
import { dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react'
import { DeleteAccountMutation, DeleteAccountMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import DeleteAccountConfirmDialog, { DeleteAccountConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/DeleteAccountConfirmDialog',
  component: DeleteAccountConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type DeleteAccountConfirmDialogStoryProps = DeleteAccountConfirmDialogProps & {
  loading: MutaionLoading
}

const Template: Story<DeleteAccountConfirmDialogStoryProps> = ({ loading, ...props }) => {
  const deleteAccount = dummyMutation<
    DeleteAccountMutation['deleteAccount'],
    DeleteAccountMutation,
    DeleteAccountMutationVariables
  >('DeleteAccount', undefined, loading)
  const mutation = { deleteAccount }
  return <DeleteAccountConfirmDialog {...{ ...props, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
