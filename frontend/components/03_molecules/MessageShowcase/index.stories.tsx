import { Text, TextProps } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { NonEmptyArray } from 'types'
import MessageShowcase, { MessageShowcaseProps } from './index'

export default {
  title: '03_molecules/MessageShowcase',
  component: MessageShowcase,
  argTypes: { onBalloonClick: { action: 'clicked' } }
} as Meta

type MessageShowcaseStoryProps = MessageShowcaseProps & {
  text: string
  textColor: TextProps['color']
  balloonBackground: NonNullable<MessageShowcaseProps['balloon']>['bgColor']
  baloonCursor: string
}

const messagePositions: NonEmptyArray<MessageShowcaseStoryProps['messagePosition']> = ['left', 'right']
const baloonCursors: NonEmptyArray<MessageShowcaseStoryProps['baloonCursor']> = ['pointer', 'auto']

const Template: Story<MessageShowcaseStoryProps> = ({ text, textColor, balloonBackground, baloonCursor, ...props }) => {
  const balloon = { bgColor: balloonBackground, cursor: baloonCursor }
  return (
    <MessageShowcase p='3' {...{ ...props, balloon }}>
      <Text {...{ color: textColor, fontSize: 'sm', whiteSpace: 'pre-wrap' }}>{text}</Text>
    </MessageShowcase>
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  messagePosition: { control: { type: 'select' }, options: messagePositions },
  textColor: { control: 'color' },
  balloonBackground: { control: 'color' },
  baloonCursor: { control: { type: 'select' }, options: baloonCursors }
}
Primary.args = {
  messagePosition: 'left',
  avatar:
    'https://1.bp.blogspot.com/-UIGZIWt-0ik/XqfJTLR5kqI/AAAAAAABYlk/5L97smvYB_YKlgVYZnOB0uSzwL0iJgQVgCNcBGAsYHQ/s1600/mask_tedukuri_woman.png',
  isRead: true,
  time: '22:15',
  text: 'テキストメッセージ',
  textColor: '#ffffff',
  balloonBackground: '#4299E1',
  baloonCursor: 'pointer'
}
