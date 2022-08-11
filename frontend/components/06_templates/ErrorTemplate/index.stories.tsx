import { Meta, Story } from '@storybook/react'
import React from 'react'
import ErrorTemplate from './index'

export default {
  title: '06_templates/ErrorTemplate',
  component: ErrorTemplate
} as Meta

const Template: Story = () => <ErrorTemplate />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
