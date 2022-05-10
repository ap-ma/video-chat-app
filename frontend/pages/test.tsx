import {
  Button,
  FormControl,
  Heading,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import Modal from 'components/03_molecules/Modal'
import React from 'react'

type ForgotPasswordFormInputs = {
  email: string
}

export default function ForgotPasswordForm(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalContent>
          <ModalCloseButton />
          <ModalBody pt='5' pb='8'>
            <Stack spacing={4}>
              <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                Forgot your password?
              </Heading>
              <Text fontSize={{ base: 'sm', sm: 'md' }} color={useColorModeValue('gray.800', 'gray.400')}>
                You&apos;ll get an email with a reset link
              </Text>
              <FormControl id='email'>
                <Input placeholder='your-email@example.com' _placeholder={{ color: 'gray.500' }} type='email' />
              </FormControl>
              <Stack spacing={6}>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500'
                  }}
                >
                  Request Reset
                </Button>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
