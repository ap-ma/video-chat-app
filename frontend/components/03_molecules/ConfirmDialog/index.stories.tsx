import { Box, Button, useDisclosure } from '@chakra-ui/react'
import { ThemingProps } from '@chakra-ui/system'
import { Meta, Story } from '@storybook/react'
import React, { ReactText } from 'react'
import ConfirmDialog, { ConfirmDialogProps } from './index'

export default {
  title: '03_molecules/ConfirmDialog',
  component: ConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type ConfirmDialogStoryProps = ConfirmDialogProps & {
  okText: ReactText
  cancelText: ReactText
  okColorScheme: ThemingProps['colorScheme']
  cancelColorScheme: ThemingProps['colorScheme']
}

const Template: Story<ConfirmDialogStoryProps> = ({
  okText,
  cancelText,
  okColorScheme,
  cancelColorScheme,
  ...props
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const ok = { children: okText, colorScheme: okColorScheme }
  const cancel = { children: cancelText, colorScheme: cancelColorScheme, onClick: onClose }
  return (
    <Box h='100vh'>
      <Button onClick={onOpen}>Open Modal</Button>
      <ConfirmDialog {...{ ...props, isOpen, ok, cancel }} />{' '}
    </Box>
  )
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  header: 'Delete Message?',
  body: ['Do you want to delete the message?', 'This operation cannot be undone.'],
  okText: 'Delete',
  cancelText: 'Cancel',
  okColorScheme: 'red',
  cancelColorScheme: 'gray'
}
