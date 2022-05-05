import { Meta, Story } from '@storybook/react'
import React from 'react'
import SigninTemplate, { SigninTemplateProps } from './index'

export default {
  title: '06_templates/SigninTemplate',
  component: SigninTemplate
} as Meta

const Template: Story<SigninTemplateProps> = (props) => <SigninTemplate {...props} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
