import { Avatar, Box, Button, Center, Heading, Text } from '@chakra-ui/react'
import React from 'react'

export default function SocialProfileSimple() {
  return (
    <Center py={6}>
      <Box maxW='320px' w='full' bg='white' boxShadow='2xl' rounded='lg' p={6} textAlign='center'>
        <Avatar
          size='xl'
          mb={4}
          pos='relative'
          src='https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
        />
        <Heading fontSize='2xl' fontFamily='body'>
          Jun
        </Heading>
        <Text fontWeight={600} color='gray.500' mb={4}>
          code: lindsey_jam3s
        </Text>
        <Button
          w='70%'
          fontSize='sm'
          rounded='lg'
          bg='blue.400'
          color='white'
          boxShadow='0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
          _hover={{ bg: 'blue.500' }}
          _focus={{ bg: 'blue.500' }}
        >
          Apply
        </Button>
      </Box>
    </Center>
  )
}
