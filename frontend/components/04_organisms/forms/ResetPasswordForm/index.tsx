import { Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import {
  ResetPasswordInput,
  ResetPasswordMutation,
  ResetPasswordMutationVariables
} from 'graphql/generated'
import React from 'react'
import {
  ContainerProps,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  ValidationErrors
} from 'types'

/** ResetPasswordForm Props */
export type ResetPasswordFormProps = {
  /**
   * トークン
   */
  token?: ResetPasswordInput['token']
  /**
   * パスワードリセットトークン検証エラー
   */
  errors?: ValidationErrors
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
      resetPassword: MutateFunction<ResetPasswordMutation, ResetPasswordMutationVariables>
    }
  }
}
/** Presenter Props */
type PresenterProps = ResetPasswordFormProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Stack spacing={4} bg='white' rounded='lg' boxShadow='lg' p={6}>
    <FormControl id='password' isRequired>
      <FormLabel>Password</FormLabel>
      <Input type='password' />
    </FormControl>
    <FormControl id='password' isRequired>
      <FormLabel>Password Confirm</FormLabel>
      <Input type='password' />
    </FormControl>
    <Stack>
      <Button bg='blue.400' color='white' _hover={{ bg: 'blue.500' }}>
        Submit
      </Button>
    </Stack>
  </Stack>
)

/** Container Component */
const Container: React.VFC<ContainerProps<ResetPasswordFormProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** ResetPasswordForm */
export default connect<ResetPasswordFormProps, PresenterProps>(
  'ResetPasswordForm',
  Presenter,
  Container
)
