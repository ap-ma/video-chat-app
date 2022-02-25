import { Meta, Story } from '@storybook/react'
import React from 'react'
import Top from './index'

export default {
  title: '99_mocks/Top',
  component: Top
} as Meta

const Template: Story = (args) => <Top {...args} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
