import { Meta, Story } from '@storybook/react'
import React from 'react'
import Home from './index'

export default {
  title: '99_mocks/Home',
  component: Home
} as Meta

const Template: Story = ({ ...props }) => <Home {...props}>Home</Home>

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
