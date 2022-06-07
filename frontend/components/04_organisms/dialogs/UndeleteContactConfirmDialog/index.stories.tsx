/* eslint-disable import/no-unresolved */
import { contactInfo, dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { UndeleteContactMutation, UndeleteContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import UndeleteContactConfirmDialog, { UndeleteContactConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/UndeleteContactConfirmDialog',
  component: UndeleteContactConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type UndeleteContactConfirmDialogStoryProps = UndeleteContactConfirmDialogProps & {
  loading: MutaionLoading
}

const Template: Story<UndeleteContactConfirmDialogStoryProps> = ({ loading, ...props }) => {
  // query
  const query = { contactInfo }

  // mutation
  const undeleteContact = dummyMutation<
    UndeleteContactMutation['undeleteContact'],
    UndeleteContactMutation,
    UndeleteContactMutationVariables
  >('UndeleteContact', undefined, loading)
  const mutation = { undeleteContact }

  return <UndeleteContactConfirmDialog {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
