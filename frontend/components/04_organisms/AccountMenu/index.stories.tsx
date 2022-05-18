/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
import { dummyMutation, me } from '.storybook/dummies'
import { Flex } from '@chakra-ui/react'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import { SignOutMutation, SignOutMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import AccountMenu, { AccountMenuProps } from './index'

export default {
  title: '04_organisms/AccountMenu',
  component: AccountMenu,
  decorators: [
    (Story) => (
      <Flex
        h='20'
        pr={{ base: 5, md: 4 }}
        bg='white'
        borderBottomWidth='1px'
        borderBottomColor='gray.200'
        alignItems='center'
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
      >
        {Story()}
      </Flex>
    ),
    (Story) => container({ height: '100%', background: '#f5f5f5' })(Story())
  ]
} as Meta

type AccountMenuStoryProps = AccountMenuProps & {
  loading: MutaionLoading
}

const Template: Story<AccountMenuStoryProps> = ({ loading, ...props }) => {
  // query
  const query = { me }

  // mutation
  const signOut = dummyMutation<SignOutMutation['signOut'], SignOutMutation, SignOutMutationVariables>(
    'SignOut',
    undefined,
    loading
  )

  const mutation = { signOut }

  return <AccountMenu {...{ ...props, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  loading: false
}
