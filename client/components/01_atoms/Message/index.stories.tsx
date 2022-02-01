/* eslint-disable import/no-unresolved */
import { chakraColors } from '.storybook/const'
import { container } from '.storybook/decorators'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import Message, { MessageProps } from './index'

export default {
  title: '01_atoms/Message',
  component: Message,
  decorators: [(Story) => container({ margin: '50px' })(Story())]
} as Meta

const triangleMarkPositions: MessageProps['triangleMarkPosition'][] = ['left', 'right', 'none']

const Template: Story<MessageProps> = ({ children, ...props }) => (
  <Message {...props}>{children}</Message>
)

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  triangleMarkPosition: { type: 'select', options: triangleMarkPositions },
  bgColor: { control: 'color' },
  textColor: { control: 'color' }
}
Primary.args = {
  triangleMarkPosition: 'none',
  bgColor: '#4299E1',
  textColor: '#ffffff',
  autoSizing: false,
  children: 'テキストメッセージ'
}

export const Chat = Template.bind({})
Chat.storyName = 'チャット'
Chat.argTypes = {
  triangleMarkPosition: { type: 'select', options: triangleMarkPositions },
  bgColor: { type: 'select', options: chakraColors },
  textColor: { type: 'select', options: chakraColors }
}
Chat.args = {
  triangleMarkPosition: 'left',
  bgColor: 'purple.400',
  textColor: 'white',
  autoSizing: true,
  children: 'テキストメッセージ'
}
