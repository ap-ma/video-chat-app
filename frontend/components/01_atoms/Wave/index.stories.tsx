/* eslint-disable import/no-unresolved */
import { chakraColors } from '.storybook/const'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import Wave, { WaveProps } from './index'

export default {
  title: '01_atoms/Wave',
  component: Wave
} as Meta

const Template: Story<WaveProps> = ({ topColor, bottomColor, animationNegativeDelay }) => (
  <Wave topColor={topColor} bottomColor={bottomColor} animationNegativeDelay={animationNegativeDelay} />
)

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  topColor: { control: 'color' },
  bottomColor: { control: 'color' }
}
Primary.args = {
  animationNegativeDelay: 2
}

export const ChakraColors = Template.bind({})
ChakraColors.storyName = 'Chakra UI Colors'
ChakraColors.argTypes = {
  topColor: { control: { type: 'select' }, options: chakraColors },
  bottomColor: { control: { type: 'select' }, options: chakraColors }
}
ChakraColors.args = {
  topColor: 'blue.200',
  bottomColor: 'blue.100',
  animationNegativeDelay: 2
}
