/* eslint-disable import/no-unresolved */
import { contactInfo, dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { BlockContactMutation, BlockContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import BlockContactConfirmDialog, { BlockContactConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/BlockContactConfirmDialog',
  component: BlockContactConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type BlockContactConfirmDialogStoryProps = BlockContactConfirmDialogProps & {
  loading: MutaionLoading
}

const Template: Story<BlockContactConfirmDialogStoryProps> = ({ loading, ...props }) => {
  // query
  const query = { contactInfo }

  // mutation
  const blockContact = dummyMutation<
    BlockContactMutation['blockContact'],
    BlockContactMutation,
    BlockContactMutationVariables
  >('BlockContact', undefined, loading)
  const mutation = { blockContact }

  return <BlockContactConfirmDialog {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
