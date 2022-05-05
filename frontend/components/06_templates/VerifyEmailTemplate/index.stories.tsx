import { Meta, Story } from '@storybook/react'
import React from 'react'
import VerifyEmailTemplate, { VerifyEmailTemplateProps } from './index'

export default {
  title: '06_templates/VerifyEmailTemplate',
  argTypes: {
    result: { control: 'boolean' },
    onClick: { action: 'clicked' }
  },
  component: VerifyEmailTemplate
} as Meta

const Template: Story<VerifyEmailTemplateProps> = (props) => <VerifyEmailTemplate {...props} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = { result: true }

export const Failure = Template.bind({})
Failure.storyName = '検証失敗'
Failure.args = { result: false }
