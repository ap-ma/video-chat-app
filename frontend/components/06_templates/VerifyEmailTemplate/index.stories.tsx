import { Meta, Story } from '@storybook/react'
import React from 'react'
import VerifyEmailTemplate, { VerifyEmailTemplateProps } from './index'

export default {
  title: '06_templates/VerifyEmailTemplate',
  component: VerifyEmailTemplate
} as Meta

const Template: Story<VerifyEmailTemplateProps> = (props) => <VerifyEmailTemplate {...props} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = { result: { control: 'boolean' } }
Primary.args = { result: true }
