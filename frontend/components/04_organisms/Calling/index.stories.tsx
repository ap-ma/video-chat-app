import { Meta, Story } from '@storybook/react'
import React from 'react'
import Calling, { CallingProps } from './index'

export default {
  title: '04_organisms/Calling',
  component: Calling,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

const Template: Story<CallingProps> = ({ ...props }) => {
  return <Calling {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true
}
