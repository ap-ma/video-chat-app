import { Meta, Story } from '@storybook/react'
import React from 'react'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from './index'

export default {
  title: '05_layouts/HtmlSkeleton',
  component: HtmlSkeleton
} as Meta

const Template: Story<HtmlSkeletonProps> = ({ children }) => (
  <HtmlSkeleton>
    <Title>Title</Title>
    {children}
  </HtmlSkeleton>
)

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = { children: 'Next.jsのContextでのみ有効なコンポーネント' }
