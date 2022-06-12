/* eslint-disable import/no-unresolved */
import { withSytle } from '.storybook/decorators'
/* eslint-enable import/no-unresolved */
import { ButtonProps } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react/types-6-0'
import React, { ReactText } from 'react'
import UserCard, { UserCardProps } from './index'

export default {
  title: '03_molecules/UserCard',
  argTypes: { onClick: { action: 'clicked' } },
  component: UserCard,
  decorators: [(Story) => withSytle({ paddingTop: '6%' })(Story())]
} as Meta

type UserCardStoryProps = UserCardProps & {
  buttonText: ReactText
  onClick: ButtonProps['onClick']
}

const Template: Story<UserCardStoryProps> = ({ buttonText, onClick, ...props }) => {
  const button = { children: buttonText, onClick }
  return <UserCard {...{ ...props, button }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  image:
    'https://1.bp.blogspot.com/-Na00Q49BuPg/XJB5IFwcscI/AAAAAAABR8g/aWBDjkVwnHU2CVeLX2dgklqWQdz03DU4wCLcBGAs/s800/pistol_pose_man.png',
  name: 'John Smith',
  note: 'code: john0021',
  buttonText: 'Open'
}
