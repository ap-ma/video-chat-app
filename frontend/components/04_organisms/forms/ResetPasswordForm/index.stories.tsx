/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import React from 'react'
import ResetPasswordForm, { ResetPasswordFormProps } from './index'

export default {
  title: '04_organisms/forms/ResetPasswordForm',
  component: ResetPasswordForm,
  decorators: [
    (Story) =>
      container({ height: '100vh', overflow: 'hidden', background: '#f5f5f5' })(
        container({ maxWidth: '500px', margin: '50px' })(Story())
      )
  ]
} as Meta

const Template: Story<ResetPasswordFormProps> = (props) => <ResetPasswordForm {...props} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
