/* eslint-disable import/no-unresolved */
import { chakraColors } from '.storybook/const'
import { container } from '.storybook/decorators'
/* eslint-enable import/no-unresolved */
import { Text } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import { ChakraColors, NonEmptyArray } from 'types'
import Balloon, { BalloonProps } from './index'

export default {
  title: '01_atoms/Balloon',
  component: Balloon,
  decorators: [(Story) => container({ margin: '50px' })(Story())]
} as Meta

type BalloonStoryProps = BalloonProps & {
  text: string
  textColor?: ChakraColors
}

const tailPositions: NonEmptyArray<BalloonProps['tailPosition']> = ['left', 'right', 'none']

export const Primary: Story<BalloonStoryProps> = ({ text, textColor, ...props }) => {
  const children = <Text {...{ color: textColor, fontSize: 'sm', whiteSpace: 'pre-wrap' }}>{text}</Text>
  return <Balloon {...props}>{children}</Balloon>
}

Primary.storyName = 'プライマリ'
Primary.argTypes = {
  tailPosition: { control: { type: 'select' }, options: tailPositions },
  bgColor: { control: 'color' },
  textColor: { control: 'color' }
}
Primary.args = {
  tailPosition: 'none',
  bgColor: '#4299E1',
  textColor: '#ffffff',
  autoSizing: false,
  text: 'テキストメッセージ'
}

export const Chat: Story<BalloonStoryProps> = ({ text, textColor, ...props }) => {
  const children = <Text {...{ color: textColor, fontSize: 'sm', whiteSpace: 'pre-wrap' }}>{text}</Text>
  return <Balloon {...props}>{children}</Balloon>
}

Chat.storyName = 'チャット'
Chat.argTypes = {
  tailPosition: { control: { type: 'select' }, options: tailPositions },
  bgColor: { control: { type: 'select' }, options: chakraColors },
  textColor: { control: { type: 'select' }, options: chakraColors }
}
Chat.args = {
  tailPosition: 'left',
  bgColor: 'purple.400',
  textColor: 'white',
  autoSizing: true,
  text: 'テキストメッセージ'
}
