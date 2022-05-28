import { Box, BoxProps, Flex, IconButton, Stack, Textarea, useBreakpointValue } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { AiOutlineFileImage, AiOutlinePhone } from 'react-icons/ai'
import { IoMdSend } from 'react-icons/io'
import { ContainerProps } from 'types'

/** SendMessageForm Props */
export type SendMessageFormProps = BoxProps
/** Presenter Props */
export type PresenterProps = SendMessageFormProps

/** Presenter Component */
const SendMessageFormPresenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Box py='5' borderTopWidth='1px' borderTopColor='gray.200' bg='gray.50'>
    <Flex w={{ base: '90%', xl: '75%' }} mx='auto' pl='4'>
      <Textarea
        bg='white'
        resize='none'
        size='sm'
        rows={useBreakpointValue({ base: 2, md: 4 })}
        placeholder='Enter your message here'
        borderWidth='2px'
        borderColor='gray.200'
        borderRadius='lg'
      />
      <Stack spacing='0' ml='1'>
        <IconButton
          size='sm'
          fontSize='xl'
          color='gray.500'
          bg='transparent'
          _hover={{ bg: 'transparent' }}
          _focus={{ border: 0 }}
          aria-label='send image'
          icon={<AiOutlineFileImage />}
        />
        <IconButton
          size='sm'
          fontSize='xl'
          color='gray.500'
          bg='transparent'
          _hover={{ bg: 'transparent' }}
          _focus={{ border: 0 }}
          aria-label='send message'
          icon={<AiOutlinePhone />}
          d={{ base: 'none', md: 'inline-flex' }}
        />
        <IconButton
          size='sm'
          fontSize='xl'
          color='blue.600'
          bg='transparent'
          _hover={{ bg: 'transparent' }}
          _focus={{ border: 0 }}
          aria-label='send message'
          icon={<IoMdSend />}
        />
      </Stack>
    </Flex>
  </Box>
)

/** Container Component */
const SendMessageFormContainer: React.VFC<ContainerProps<SendMessageFormProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** SendMessageForm */
export default connect<SendMessageFormProps, PresenterProps>(
  'SendMessageForm',
  SendMessageFormPresenter,
  SendMessageFormContainer
)
