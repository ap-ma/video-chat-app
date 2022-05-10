/* eslint-disable import/no-unresolved */
import { dummyMutation } from '.storybook/dummies'
/* eslint-enable import/no-unresolved  */
import { Flex, Stack } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react'
import { SignInMutation, SignInMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import SigninForm, { SigninFormProps } from './index'

export default {
  title: '04_organisms/forms/SigninForm',
  component: SigninForm,
  decorators: [
    (Story) => (
      <Flex overflow='hidden' align='center' justify='center' minH='100vh' bg='gray.50'>
        <Stack spacing={8} minW={{ base: 'full', sm: 'md' }} maxW='lg' mt='-10%' mx='auto' py={12} px={6}>
          {Story()}
        </Stack>
      </Flex>
    )
  ]
} as Meta

type SigninFormStoryFormProps = SigninFormProps & {
  loading: MutaionLoading
}

const Template: Story<SigninFormStoryFormProps> = ({ loading, ...props }) => {
  const signIn = dummyMutation<SignInMutation['signIn'], SignInMutation, SignInMutationVariables>(
    'SignIn',
    undefined,
    loading
  )
  const mutation = { signIn }
  return <SigninForm {...{ ...props, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  loading: false
}
