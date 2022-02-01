import { Meta, Story } from '@storybook/react'
import React from 'react'
import SignUp from './index'

export default {
  title: '99_mocks/SignUp',
  component: SignUp
} as Meta

const Template: Story = (args) => <SignUp {...args} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
