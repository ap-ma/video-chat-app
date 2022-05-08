import { Button, Checkbox, FormControl, FormLabel, Input, Link, Stack } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import {
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables,
  SignInMutation,
  SignInMutationVariables
} from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'

/** SigninForm Props */
export type SigninFormProps = {
  /**
   * サインイン
   */
  signIn: {
    loading: MutaionLoading
    errors?: ValidationErrors
    reset: MutaionReset
    mutate: MutateFunction<SignInMutation, SignInMutationVariables>
  }
  /**
   * パスワード忘れ
   */
  forgotPassword: {
    result?: ForgotPasswordMutation['forgotPassword']
    loading: MutaionLoading
    errors?: ValidationErrors
    reset: MutaionReset
    mutate: MutateFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>
  }
}
/** Presenter Props */
type PresenterProps = SigninFormProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = () => (
  <Stack spacing={4} rounded='lg' bg='white' boxShadow='lg' p={8}>
    <FormControl id='email'>
      <FormLabel>Email address</FormLabel>
      <Input type='email' />
    </FormControl>
    <FormControl id='password'>
      <FormLabel>Password</FormLabel>
      <Input type='password' />
    </FormControl>
    <Stack spacing={10}>
      <Stack direction={{ base: 'column', sm: 'row' }} align='start' justify='space-between'>
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
)

/** Container Component */
const Container: React.VFC<ContainerProps<SigninFormProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** SigninForm */
export default connect<SigninFormProps, PresenterProps>('SigninForm', Presenter, Container)
