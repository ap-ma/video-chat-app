/* eslint-disable import/no-unresolved */
import { dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Flex, Stack } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react'
import { ResetPasswordMutation, ResetPasswordMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import ResetPasswordForm, { ResetPasswordFormProps } from './index'

export default {
  title: '04_organisms/forms/ResetPasswordForm',
  component: ResetPasswordForm,
  decorators: [
    (Story) => (
      <Flex overflow='hidden' align='center' justify='center' minH='100vh' bg='gray.50'>
        <Stack spacing={8} minW={{ base: 'full', sm: 'md' }} maxW='lg' mt='-8%' mx='auto' py={12} px={6}>
          {Story()}
        </Stack>
      </Flex>
    )
  ]
} as Meta

type ResetPasswordStoryFormProps = ResetPasswordFormProps & {
  loading: MutaionLoading
}

const Template: Story<ResetPasswordStoryFormProps> = ({ loading, ...props }) => {
  const resetPassword = dummyMutation<
    ResetPasswordMutation['resetPassword'],
    ResetPasswordMutation,
    ResetPasswordMutationVariables
  >('ResetPassword', undefined, loading)
  const mutation = { resetPassword }
  return <ResetPasswordForm {...{ ...props, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  loading: false
}
