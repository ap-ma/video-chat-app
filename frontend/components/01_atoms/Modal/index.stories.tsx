/* eslint-disable import/no-unresolved */
import { chakraColors } from '.storybook/const'
/* eslint-enable import/no-unresolved */
import { Box, Button, Input, ModalCloseButton, ModalContent, useDisclosure } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { ChakraColors } from 'types'
import Modal, { ModalProps } from './index'

export default {
  title: '01_atoms/Modal',
  component: Modal
} as Meta

const Template: Story<
  ModalProps & {
    background: ChakraColors
  }
> = ({ background, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box bg={background} h='100vh'>
      <Button onClick={onOpen}>Open Modal</Button>
      <Modal {...{ ...props, isOpen, onClose }}>
        <ModalContent>
          <ModalCloseButton />
          <Box bg='white' p='10'>
            文字を入力してください
            <Input />
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.argTypes = {
  background: { control: { type: 'select' }, options: chakraColors }
}
Primary.args = {
  background: 'blue.100'
}
