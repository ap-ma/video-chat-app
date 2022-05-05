import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack
} from '@chakra-ui/react'
import React from 'react'

export default function ResetPasswordForm(): JSX.Element {
  return (
    <Flex minH='100vh' align='center' justify='center' bg='gray.50'>
      <Stack spacing={4} w='full' maxW='md' bg='white' rounded='xl' boxShadow='lg' p={6} my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Enter new password
        </Heading>
        <FormControl id='password' isRequired isInvalid={true}>
          <FormLabel>Password</FormLabel>
          <Input type='password' _invalid={{ backgroundColor: 'red.100' }} />
          <FormErrorMessage>エラーメッセージ</FormErrorMessage>
        </FormControl>
        <FormControl id='password' isRequired isInvalid={true}>
          <FormLabel>Password Confirm</FormLabel>
          <Input type='password' />
          <FormErrorMessage>エラーメッセージ</FormErrorMessage>
        </FormControl>
        <Stack spacing={6}>
          <Button bg='blue.400' color='white' _hover={{ bg: 'blue.500' }}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}
