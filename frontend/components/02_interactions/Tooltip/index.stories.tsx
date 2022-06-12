/* eslint-disable import/no-unresolved */
import { withSytle } from '.storybook/decorators'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import Bubble from 'components/01_atoms/Bubble'
import React from 'react'
import Tooltip, { Marker, MarkerProps, Tip, TooltipProps } from './index'

export default {
  title: '02_interactions/Tooltip',
  component: Tooltip,
  decorators: [(Story) => withSytle({ display: 'inline-block', margin: '50px' })(Story())]
} as Meta

type TooltipStoryProps = TooltipProps & {
  content: string
  tip: string
}

export const Primary: Story<TooltipStoryProps> = ({ content, tip }) => {
  return (
    <Tooltip>
      <span>{content}</span>
      <Tip>{tip}</Tip>
    </Tooltip>
  )
}
Primary.storyName = 'プライマリ'
Primary.args = {
  content: 'ホバーでチップを表示',
  tip: 'チップの内容'
}

export const MarkerHover: Story<TooltipStoryProps & { markerColor?: MarkerProps['mkColor'] }> = ({
  content,
  tip,
  markerColor
}) => {
  return (
    <Tooltip>
      <Marker mkColor={markerColor}>{content}</Marker>
      <Tip>
        <span>{tip}</span>
      </Tip>
    </Tooltip>
  )
}
MarkerHover.storyName = 'マーカー'
MarkerHover.argTypes = { markerColor: { control: 'color' } }
MarkerHover.args = {
  content: 'ホバーでチップを表示',
  tip: 'チップの内容'
}

export const BubbleHover: Story<TooltipStoryProps & { markerColor?: MarkerProps['mkColor'] }> = ({
  content,
  tip,
  markerColor
}) => {
  return (
    <p>
      ホバーで
      <Tooltip>
        <Marker mkColor={markerColor}>{content}</Marker>
        <Tip>
          <Bubble>{tip}</Bubble>
        </Tip>
      </Tooltip>
      を表示
    </p>
  )
}
BubbleHover.storyName = 'バルーン'
BubbleHover.argTypes = { markerColor: { control: 'color' } }
BubbleHover.args = {
  content: 'バルーンチップ',
  tip: '注釈を記述',
  markerColor: '#9DECF9'
}
