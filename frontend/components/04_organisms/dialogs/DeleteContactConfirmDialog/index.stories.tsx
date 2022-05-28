/* eslint-disable import/no-unresolved */
import { dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { DeleteContactMutation, DeleteContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import DeleteContactConfirmDialog, { DeleteContactConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/DeleteContactConfirmDialog',
  component: DeleteContactConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type DeleteContactConfirmDialogStoryProps = DeleteContactConfirmDialogProps & {
  loading: MutaionLoading
}

const Template: Story<DeleteContactConfirmDialogStoryProps> = ({ loading, ...props }) => {
  const deleteContact = dummyMutation<
    DeleteContactMutation['deleteContact'],
    DeleteContactMutation,
    DeleteContactMutationVariables
  >('DeleteContact', undefined, loading)
  const mutation = { deleteContact }
  return <DeleteContactConfirmDialog {...{ ...props, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
