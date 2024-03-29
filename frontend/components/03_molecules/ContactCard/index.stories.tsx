/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
/* eslint-enable import/no-unresolved */
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import ContactCard, { ContactCardProps } from './index'

export default {
  title: '03_molecules/ContactCard',
  argTypes: { onClick: { action: 'clicked' } },
  component: ContactCard
} as Meta

const Template: Story<ContactCardProps> = (props) => <ContactCard {...props} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.decorators = [
  (Story) => container({ width: '270px', margin: '25px' })(Story()),
  (Story) => container({ height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' })(Story())
]
Primary.args = {
  image:
    'https://1.bp.blogspot.com/-Na00Q49BuPg/XJB5IFwcscI/AAAAAAABR8g/aWBDjkVwnHU2CVeLX2dgklqWQdz03DU4wCLcBGAs/s800/pistol_pose_man.png',
  name: '鈴木太郎',
  content: 'ひとことメッセージ',
  active: false
}

export const Unread = Template.bind({})
Unread.storyName = '未読メッセージ'
Unread.decorators = [
  (Story) => container({ width: '270px', margin: '25px' })(Story()),
  (Story) => container({ height: '100vh', overflow: 'hidden', backgroundColor: '#f5f5f5' })(Story())
]
Unread.args = {
  image:
    'https://1.bp.blogspot.com/-gTf4sWnRdDw/X0B4RSQQLrI/AAAAAAABarI/MJ9DW90dSVwtMjuUoErxemnN4nPXBnXUwCNcBGAsYHQ/s1600/otaku_girl_fashion.png',
  name: '佐藤亜美',
  content: '本日プロジェクトについての打ち合わせを行いたいです。何時ごろお時間都合がよいでしょうか？',
  active: false,
  unreadCount: 3
}

export const Active = Template.bind({})
Active.storyName = '選択状態'
Active.decorators = [(Story) => container({ width: '270px', margin: '25px' })(Story())]
Active.argTypes = { unreadCount: { control: 'number' } }
Active.args = {
  image:
    'https://1.bp.blogspot.com/-gTf4sWnRdDw/X0B4RSQQLrI/AAAAAAABarI/MJ9DW90dSVwtMjuUoErxemnN4nPXBnXUwCNcBGAsYHQ/s1600/otaku_girl_fashion.png',
  name: '佐藤亜美',
  content: '本日プロジェクトについての打ち合わせを行いたいです。何時ごろお時間都合がよいでしょうか？',
  active: true,
  unreadCount: undefined
}
