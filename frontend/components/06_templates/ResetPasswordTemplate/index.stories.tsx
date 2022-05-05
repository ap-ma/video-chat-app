import { Meta, Story } from '@storybook/react'
import React from 'react'
import ResetPasswordTemplate, { ResetPasswordTemplateProps } from './index'

export default {
  title: '06_templates/ResetPasswordTemplate',
  component: ResetPasswordTemplate
} as Meta

const Template: Story<ResetPasswordTemplateProps> = (props) => <ResetPasswordTemplate {...props} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
