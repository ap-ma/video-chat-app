/* eslint-disable import/no-unresolved */
import { withSytle } from '.storybook/decorators'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import AppLogo, { AppLogoProps } from './index'

export default {
  title: '01_atoms/AppLogo',
  component: AppLogo,
  decorators: [(Story) => withSytle({ margin: '70px' })(Story())]
} as Meta

const Template: Story<AppLogoProps> = ({ ...props }) => <AppLogo {...props} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  fontSize: '4.5rem'
}
