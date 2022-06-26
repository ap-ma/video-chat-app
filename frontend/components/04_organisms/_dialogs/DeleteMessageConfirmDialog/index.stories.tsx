/* eslint-disable import/no-unresolved */
import { dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react'
import { DeleteMessageMutation, DeleteMessageMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import DeleteMessageConfirmDialog, { DeleteMessageConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/DeleteMessageConfirmDialog',
  component: DeleteMessageConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type DeleteMessageConfirmDialogStoryProps = DeleteMessageConfirmDialogProps & {
  loading: MutaionLoading
}

const Template: Story<DeleteMessageConfirmDialogStoryProps> = ({ loading, ...props }) => {
  // message id
  const messageId = '1'

  // mutation
  const deleteMessage = dummyMutation<
    DeleteMessageMutation['deleteMessage'],
    DeleteMessageMutation,
    DeleteMessageMutationVariables
  >('DeleteMessage', undefined, loading)
  const mutation = { deleteMessage }

  return <DeleteMessageConfirmDialog {...{ ...props, messageId, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
