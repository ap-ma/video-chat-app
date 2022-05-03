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
import HtmlSkeleton, { Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import {
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables,
  SignInMutation,
  SignInMutationVariables,
  SignUpMutation,
  SignUpMutationVariables
} from 'graphql/generated'
import React from 'react'
import {
  ContainerProps,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  ValidationErrors
} from 'types'

/** SigninTemplate Props */
export type SigninTemplateProps = {
  /**
   * サインイン
   */
  signIn: {
    loading: MutaionLoading
    errors?: ValidationErrors
    reset: MutaionReset
    signIn: MutateFunction<SignInMutation, SignInMutationVariables>
  }
  /**
   * サインアップ
   */
  signUp: {
    result?: SignUpMutation['signUp']
    loading: MutaionLoading
    errors?: ValidationErrors
    reset: MutaionReset
    signUp: MutateFunction<SignUpMutation, SignUpMutationVariables>
  }
  /**
   * パスワード忘れ
   */
  forgotPassword: {
    result?: ForgotPasswordMutation['forgotPassword']
    loading: MutaionLoading
    errors?: ValidationErrors
    reset: MutaionReset
    forgotPassword: MutateFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>
  }
}
/** Presenter Props */
type PresenterProps = SigninTemplateProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = () => (
  <HtmlSkeleton>
    <Title>Signin</Title>
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
  </HtmlSkeleton>
)

/** Container Component */
const Container: React.VFC<ContainerProps<SigninTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** SigninTemplate */
export default connect<SigninTemplateProps, PresenterProps>('SigninTemplate', Presenter, Container)
