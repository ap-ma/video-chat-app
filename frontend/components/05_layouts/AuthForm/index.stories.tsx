/* eslint-disable import/no-unresolved */
import { chakraColors } from '.storybook/const'
/* eslint-enable import/no-unresolved  */
import {
  Button,
  ButtonProps,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack
} from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react'
import BackgroundWave, { BackgroundWaveProps } from 'components/03_molecules/BackgroundWave'
import React, { Fragment } from 'react'
import AuthForm, { AuthFormProps } from './index'

export default {
  title: '05_layouts/AuthForm',
  argTypes: { onClick: { action: 'clicked' } },
  args: { headText: 'Input Form', input1: 'field1', input2: 'field2' },
  component: AuthForm
} as Meta

type AuthFormStoryProps = AuthFormProps & {
  headText: string
  input1: string
  input2: string
  onClick: ButtonProps['onClick']
}

const Template: Story<AuthFormStoryProps> = ({ headText, input1, input2, onClick }) => (
  <Fragment>
    <Heading textAlign='center' lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
      {headText}
    </Heading>
    <Stack spacing={4} bg='white' rounded='lg' boxShadow='lg' p={6}>
      <FormControl isRequired>
        <FormLabel>{input1}</FormLabel>
        <Input type='text' />
      </FormControl>
      <FormControl>
        <FormLabel>{input2}</FormLabel>
        <Input type='text' />
      </FormControl>
      <Stack>
        <Button bg='blue.400' color='white' _hover={{ bg: 'blue.500' }} onClick={onClick}>
          Submit
        </Button>
      </Stack>
    </Stack>
  </Fragment>
)

export const Primary: Story<AuthFormStoryProps> = (props) => {
  return (
    <AuthForm>
      <Template {...props} />
    </AuthForm>
  )
}
Primary.storyName = 'プライマリ'

export const Wave: Story<AuthFormStoryProps & BackgroundWaveProps> = ({
  topColor,
  bottomColor,
  animationNegativeDelay,
  ...props
}) => {
  return (
    <BackgroundWave {...{ topColor, bottomColor, animationNegativeDelay }}>
      <AuthForm bg='inherit'>
        <Template {...props} />
      </AuthForm>
    </BackgroundWave>
  )
}
Wave.storyName = 'Waveバックグラウンド'
Wave.argTypes = {
  topColor: { control: { type: 'select' }, options: chakraColors },
  bottomColor: { control: { type: 'select' }, options: chakraColors }
}
Wave.args = {
  topColor: 'gray.100',
  bottomColor: 'gray.50',
  animationNegativeDelay: 2
}
