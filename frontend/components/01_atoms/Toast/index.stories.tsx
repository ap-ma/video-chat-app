import { Button } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import toast from './index'

export default {
  title: '01_atoms/Toast',
  component: Button
} as Meta

const Template: Story<{ type: Parameters<typeof toast>[0] }> = ({ type }) => {
  return <Button onClick={toast(type)}>トーストを表示</Button>
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  type: {
    control: { type: 'select' },
    options: ['EditProfileComplete', 'ValidationError', 'UnexpectedError']
  }
}
Primary.args = {
  type: 'EditProfileComplete'
}
