import { Meta, Story } from '@storybook/react'
import React from 'react'
import Layout, { LayoutProps, Title } from './index'

export default {
  title: '05_layouts/Layout',
  component: Layout
} as Meta

const Template: Story<LayoutProps> = ({ children }) => (
  <Layout>
    <Title>Title</Title>
    {children}
  </Layout>
)

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  children: 'Next.jsのContextのみで有効なコンポーネント'
}
