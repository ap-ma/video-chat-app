/* eslint-disable import/no-unresolved */
import { chakraColors } from '.storybook/const'
/* eslint-enable import/no-unresolved  */
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text
} from '@chakra-ui/react'
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
      <Stack spacing={8} mt='-10%' mx='auto' maxW='lg' py={12} px={6}>
        <Stack align='center'>
          <Heading fontSize='4xl'>Sign in to your account</Heading>
          <Text fontSize='lg' color='gray.600'>
            New to this app?
            <Link color='blue.400' ml={2}>
              Create an account.
            </Link>
          </Text>
        </Stack>
        <Box rounded='lg' bg='white' boxShadow='lg' p={8}>
          <Stack spacing={4}>
            <FormControl id='email'>
              <FormLabel>Email address</FormLabel>
              <Input type='email' />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>Password</FormLabel>
              <Input type='password' />
            </FormControl>
            <Stack spacing={10}>
              <Stack direction={{ base: 'column', sm: 'row' }} align='start' justify='space-between'>
                <Checkbox>Remember me</Checkbox>
                <Link color='blue.400'>Forgot password?</Link>
              </Stack>
              <Button
                bg='blue.400'
                color='white'
                _hover={{
                  bg: 'blue.500'
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
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
