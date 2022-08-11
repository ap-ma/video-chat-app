import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import Bubble, { BubbleProps } from './index'

export default {
  title: '01_atoms/Bubble',
  component: Bubble
} as Meta

export const Primary: Story<BubbleProps> = ({ children }) => <Bubble>{children}</Bubble>
Primary.storyName = 'プライマリ'
Primary.args = {
  children: 'バルーン'
}

export const AbsolutePosition: Story<BubbleProps & { position: number }> = ({ position }) => {
  const content = `左上から ${position}px`
  return <Bubble style={{ position: 'absolute', top: `${position}px`, left: `${position}px` }}>{content}</Bubble>
}
AbsolutePosition.storyName = '絶対位置指定配置'
AbsolutePosition.argTypes = { position: { control: 'number' } }
AbsolutePosition.args = {
  position: 100
}
