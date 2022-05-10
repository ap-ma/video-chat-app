/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import ErrorMessage, { ErrorMessageProps } from './index'

export default {
  title: '01_atoms/ErrorMessage',
  component: ErrorMessage,
  decorators: [(Story) => container({ margin: '50px' })(Story())]
} as Meta

const Template: Story<ErrorMessageProps> = ({ error }) => <ErrorMessage error={error} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  error: 'Invalid value'
}

export const Multiple = Template.bind({})
Multiple.storyName = '複数'
Multiple.argTypes = {
  errors: { control: 'object' }
}
Multiple.args = {
  error: ['Invalid value', 'Invalid field']
}
