/* eslint-disable import/no-unresolved */
import { chakraColors } from '.storybook/const'
/* eslint-enable import/no-unresolved */
import { Box, Flex } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import BackgroundWave, { BackgroundWaveProps } from './index'

export default {
  title: '03_molecules/BackgroundWave',
  component: BackgroundWave
} as Meta

export const Primary: Story<BackgroundWaveProps> = ({ topColor, bottomColor, animationNegativeDelay }) => (
  <BackgroundWave topColor={topColor} bottomColor={bottomColor} animationNegativeDelay={animationNegativeDelay}>
    <Flex align='center' justify='center' minH='100vh'>
      <Box
        bg='white'
        border='solid'
        mt='-10%'
        mx='auto'
        minH='50vh'
        minW='30vw'
        maxW='lg'
        py={12}
        px={6}
        textAlign='center'
      >
        背景がWave
      </Box>
    </Flex>
  </BackgroundWave>
)
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  topColor: { control: { type: 'select' }, options: chakraColors },
  bottomColor: { control: { type: 'select' }, options: chakraColors }
}
Primary.args = {
  topColor: 'gray.100',
  bottomColor: 'gray.50',
  animationNegativeDelay: 2
}
