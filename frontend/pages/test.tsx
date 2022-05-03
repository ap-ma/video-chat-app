import { Box, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react'
import Link from 'components/01_atoms/Link'
import React from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'

export default function Test(): React.ReactElement {
  return (
    <Flex minH='100vh' align='center' justify='center' py={12} bg='gray.50'>
      <Stack
        minW={[null, '80vw', '680px']}
        boxShadow='2xl'
        bg='white'
        rounded='xl'
        p={10}
        pt={7}
        mt='-20vh'
        spacing={10}
        align='center'
      >
        <Stack align='center'>
          <Icon as={RiErrorWarningLine} w={16} h={16} color='red.500' />
          <Heading fontSize='3xl' color='gray.800'>
            Email Verified
          </Heading>
        </Stack>
        <Stack align='center' spacing={1}>
          <Text fontSize='xl' color='gray.500'>
            Email verification has been completed.
          </Text>
          <Text fontSize='xl' color='gray.500'>
            Click the link below to go to the home page.
          </Text>
          <Box p='1.5' />
          <Link color='blue.400' href='/error'>
            Go to Home
          </Link>
        </Stack>
      </Stack>
    </Flex>
  )
}
