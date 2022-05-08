import { SmallCloseIcon } from '@chakra-ui/icons'
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react'
import React from 'react'

export default function ResetPasswordForm(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal motionPreset='slideInBottom' closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={'md'}>
        <ModalOverlay bg='none' backdropFilter='auto' backdropInvert='80%' backdropBlur='2px' />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody pt={5} pb={8}>
            <Stack spacing={4}>
              <Heading lineHeight={1.1} pb={1} fontSize={{ base: '2xl', sm: '3xl' }}>
                Sign up
              </Heading>
              <FormControl id='userName' pb={2}>
                <Stack direction={['column', 'row']} spacing={6}>
                  <Center>
                    <Avatar
                      size='xl'
                      src='https://1.bp.blogspot.com/-WoPLgzbefuw/X-FcxFa-YjI/AAAAAAABdE0/42S9V3wWi400mGKLEiB_pQT-dqTKT28kwCNcBGAsYHQ/s1156/onepiece14_enel.png'
                    >
                      <AvatarBadge
                        as={IconButton}
                        size='sm'
                        rounded='full'
                        top='-10px'
                        colorScheme='red'
                        aria-label='remove Image'
                        icon={<SmallCloseIcon />}
                      />
                    </Avatar>
                  </Center>
                  <Center w='full'>
                    <Button w='full'>Change Icon</Button>
                  </Center>
                </Stack>
              </FormControl>

              <Stack spacing={2} direction={['column', 'row']}>
                <Box w='full'>
                  <FormControl id='password' isRequired>
                    <FormLabel>Code</FormLabel>
                    <Tooltip label='Code for friends to find you.' placement='bottom' closeOnClick={false}>
                      <Input
                        placeholder='code'
                        _placeholder={{ color: 'gray.500' }}
                        type='text'
                        _invalid={{ backgroundColor: 'red.100' }}
                      />
                    </Tooltip>
                    <FormErrorMessage>Error message.</FormErrorMessage>
                  </FormControl>
                </Box>
                <Box w='full'>
                  <FormControl id='password' isRequired>
                    <FormLabel>Nickname</FormLabel>
                    <Input
                      placeholder='nickname'
                      _placeholder={{ color: 'gray.500' }}
                      type='text'
                      _invalid={{ backgroundColor: 'red.100' }}
                    />
                    <FormErrorMessage>Error message.</FormErrorMessage>
                  </FormControl>
                </Box>
              </Stack>
              <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder='your-email@example.com'
                  _placeholder={{ color: 'gray.500' }}
                  type='email'
                  _invalid={{ backgroundColor: 'red.100' }}
                />
                <FormErrorMessage>Error message.</FormErrorMessage>
              </FormControl>

              <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  placeholder='password'
                  _placeholder={{ color: 'gray.500' }}
                  type='password'
                  _invalid={{ backgroundColor: 'red.100' }}
                />
                <FormErrorMessage>Error message.</FormErrorMessage>
              </FormControl>

              <FormControl id='password' isRequired isInvalid={true}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  placeholder='confirm password'
                  _placeholder={{ color: 'gray.500' }}
                  type='password'
                  _invalid={{ backgroundColor: 'red.100' }}
                />
                <FormErrorMessage>Error message.</FormErrorMessage>
              </FormControl>
              <FormControl id='email'>
                <FormLabel>Comment</FormLabel>
                <Input
                  placeholder='comment...'
                  _placeholder={{ color: 'gray.500' }}
                  type='email'
                  _invalid={{ backgroundColor: 'red.100' }}
                />
                <FormErrorMessage>Error message.</FormErrorMessage>
              </FormControl>
              <Box />
              <Button
                bg={'blue.400'}
                color={'white'}
                w='full'
                _hover={{
                  bg: 'blue.500'
                }}
              >
                Sign up
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
