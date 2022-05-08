import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import Balloon, { BalloonProps } from './index'

export default {
  title: '01_atoms/Ballon',
  component: Balloon
} as Meta

export const Primary: Story<BalloonProps> = ({ children }) => <Balloon>{children}</Balloon>
Primary.storyName = 'プライマリ'
Primary.args = {
  children: 'バルーン'
}

export const AbsolutePosition: Story<BalloonProps & { position: number }> = ({ position }) => {
  const content = `左上から ${position}px`
  return <Balloon style={{ position: 'absolute', top: `${position}px`, left: `${position}px` }}>{content}</Balloon>
}
AbsolutePosition.storyName = '絶対位置指定配置'
AbsolutePosition.argTypes = { position: { control: 'number' } }
AbsolutePosition.args = {
  position: 100
}
