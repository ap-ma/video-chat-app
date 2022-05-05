/* eslint-disable import/no-unresolved */
import { chakraColors } from '.storybook/const'
import { container } from '.storybook/decorators'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react/types-6-0'
import React, { Fragment } from 'react'
import Link, { LinkProps } from './index'

export default {
  title: '01_atoms/Link',
  component: Link,
  argTypes: { onClick: { action: 'clicked' } },
  decorators: [(Story) => container({ margin: '50px' })(Story())]
} as Meta

const Template: Story<LinkProps> = ({ children, ...props }) => (
  <Fragment>
    <Link {...props}>{children}</Link>
  </Fragment>
)

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  href: '#',
  children: 'Next.jsのContextでのみ遷移が発生'
}

export const ChakraColors = Template.bind({})
ChakraColors.storyName = 'Chakra UI Colors'
ChakraColors.argTypes = { color: { control: { type: 'select' }, options: chakraColors } }
ChakraColors.args = {
  href: '#',
  children: 'Next.jsのContextでのみ遷移が発生',
  color: 'blue.400'
}
