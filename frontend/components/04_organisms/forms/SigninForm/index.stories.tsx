import { Flex, Stack } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react'
import React from 'react'
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

const Template: Story<SigninFormProps> = (props) => <SigninForm {...props} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
