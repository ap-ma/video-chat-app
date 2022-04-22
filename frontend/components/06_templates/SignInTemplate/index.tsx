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
import Wave from 'components/01_atoms/Wave'
import Layout, { Title } from 'components/05_layouts/Layout'
import { connect } from 'components/hoc'
import React, { Fragment } from 'react'
import { ContainerProps } from 'types'

/** SignInTemplate Props */
export type SignInTemplateProps = Record<string, unknown>
/** Presenter Props */
type PresenterProps = SignInTemplateProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Layout>
    <Title>signin</Title>
    <Fragment>
      <Box h='100vh'>
        <Flex align='center' justify='center'>
          <Stack spacing={8} mx='auto' maxW='lg' py={12} px={6}>
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
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align='start'
                    justify='space-between'
                  >
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
      </Box>
      <Box h='100vh' mt='-100vh' pos='relative' zIndex={-1} bg='gray.50'>
        <Box h='400px' bg='gray.100' />
        <Wave topColor='gray.100' bottomColor='gray.50' animationNegativeDelay={2} />
      </Box>
    </Fragment>
  </Layout>
)

/** Container Component */
const Container: React.VFC<ContainerProps<SignInTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** SignInTemplate */
export default connect<SignInTemplateProps, PresenterProps>('SignInTemplate', Presenter, Container)
