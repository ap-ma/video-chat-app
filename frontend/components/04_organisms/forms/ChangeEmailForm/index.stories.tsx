/* eslint-disable import/no-unresolved */
import { dummyMe, dummyMutation, userId } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { ChangeEmailMutation, ChangeEmailMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading, QueryLoading } from 'types'
import ChangeEmailForm, { ChangeEmailFormProps } from './index'

export default {
  title: '04_organisms/forms/ChangeEmailForm',
  component: ChangeEmailForm
} as Meta

type ChangeEmailFormStoryProps = ChangeEmailFormProps & {
  meLoading: QueryLoading
  changeEmailLoading: MutaionLoading
}

const Template: Story<ChangeEmailFormStoryProps> = ({ meLoading, changeEmailLoading, ...props }) => {
  // query
  const me = dummyMe(userId, meLoading, undefined)
  const query = { me }

  // mutation
  const changeEmail = dummyMutation<
    ChangeEmailMutation['changeEmail'],
    ChangeEmailMutation,
    ChangeEmailMutationVariables
  >('ChangeEmail', undefined, changeEmailLoading)

  const mutation = { changeEmail }

  return <ChangeEmailForm {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  meLoading: false,
  changeEmailLoading: false
}
