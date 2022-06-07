/* eslint-disable import/no-unresolved */
import { contactInfo, dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { ApplyContactMutation, ApplyContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import ApplyContactConfirmDialog, { ApplyContactConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/ApplyContactConfirmDialog',
  component: ApplyContactConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type ApplyContactConfirmDialogStoryProps = ApplyContactConfirmDialogProps & {
  loading: MutaionLoading
}

const Template: Story<ApplyContactConfirmDialogStoryProps> = ({ loading, ...props }) => {
  // query
  const query = { contactInfo }

  // mutation
  const applyContact = dummyMutation<
    ApplyContactMutation['applyContact'],
    ApplyContactMutation,
    ApplyContactMutationVariables
  >('ApplyContact', undefined, loading)
  const mutation = { applyContact }

  return <ApplyContactConfirmDialog {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  loading: false
}
