import { Heading, Icon, Text } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BsCheckLg } from 'react-icons/bs'
import ResultIndication, { Body, Head } from './index'

export default {
  title: '05_layouts/ResultIndication',
  component: ResultIndication
} as Meta

const Template: Story<
  Partial<{
    headText: string
    bodyText: string
  }>
> = ({ headText, bodyText }) => (
  <ResultIndication>
    <Head>
      <Icon as={BsCheckLg} w={16} h={16} color='green.500' />
      <Heading textTransform='uppercase' fontSize='3xl' color='gray.800'>
        {headText}
      </Heading>
    </Head>
    <Body>
      <Text fontSize='xl' color='gray.500'>
        {bodyText}
      </Text>
    </Body>
  </ResultIndication>
)

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  headText: 'success',
  bodyText: 'Completed successfully!'
}
