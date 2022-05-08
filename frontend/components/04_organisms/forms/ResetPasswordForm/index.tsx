import { Alert, AlertIcon, Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import { ResetPasswordInput, ResetPasswordMutation, ResetPasswordMutationVariables } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'
import { isBlank } from 'utils/general/object'
import { getErrMsg } from 'utils/helper'

/** ResetPasswordForm Props */
export type ResetPasswordFormProps = {
  /**
   * トークン
   */
  token?: ResetPasswordInput['token']
  /**
   * パスワードリセットトークン検証エラー
   */
  tokenErrors?: ValidationErrors
  /**
   * Mutation
   */
  mutation: {
    /**
     * パスワードリセット
     */
    resetPassword: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ResetPasswordMutation, ResetPasswordMutationVariables>
    }
  }
}
/** Presenter Props */
type PresenterProps = {
  disabled: boolean
  tokenErrMsgs?: string[]
}

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ disabled, tokenErrMsgs, ...props }) => (
  <Stack spacing={4} bg='white' rounded='lg' boxShadow='lg' p={6}>
    {tokenErrMsgs?.map((msg, i) => (
      <Alert status='error' key={i} rounded='lg'>
        <AlertIcon />
        {msg}
      </Alert>
    ))}
    <FormControl id='password' isRequired isDisabled={disabled}>
      <FormLabel>Password</FormLabel>
      <Input type='password' />
    </FormControl>
    <FormControl id='password' isRequired isDisabled={disabled}>
      <FormLabel>Password Confirm</FormLabel>
      <Input type='password' disabled={disabled} />
    </FormControl>
    <Stack>
      <Button bg='blue.400' color='white' _hover={{ bg: 'blue.500' }} disabled={disabled}>
        Submit
      </Button>
    </Stack>
  </Stack>
)

/** Container Component */
const Container: React.VFC<ContainerProps<ResetPasswordFormProps, PresenterProps>> = ({
  presenter,
  tokenErrors,
  mutation,
  ...props
}) => {
  const tokenErr = !isBlank(tokenErrors)
  const tokenErrMsgs = tokenErrors?.map((error) => getErrMsg(error.message))

  const disabled = tokenErr
  return presenter({ disabled, tokenErrMsgs, ...props })
}

/** ResetPasswordForm */
export default connect<ResetPasswordFormProps, PresenterProps>('ResetPasswordForm', Presenter, Container)
