import { Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, StackProps } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import AlertMessage from 'components/01_atoms/AlertMessage'
import ErrorMessage from 'components/01_atoms/ErrorMessage'
import Toast from 'components/01_atoms/Toast'
import { connect } from 'components/hoc'
import { useSetError } from 'components/hooks'
import { ResetPasswordInput, ResetPasswordMutation, ResetPasswordMutationVariables } from 'graphql/generated'
import React from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'
import { toStr } from 'utils/general/helper'
import { hasValue, isBlank } from 'utils/general/object'
import { getErrMsg } from 'utils/helper'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** ResetPasswordForm Props */
export type ResetPasswordFormProps = StackProps & {
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
      result?: ResetPasswordMutation['resetPassword']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ResetPasswordMutation, ResetPasswordMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ResetPasswordFormProps, 'token' | 'tokenErrors' | 'mutation'> & {
  disabled: boolean
  loading: MutaionLoading
  errors: string[]
  fieldErrors: FieldErrors<FormSchema>
  tokenErrorMsgs: string[] | undefined
  register: UseFormRegister<FormSchema>
  onSubmitButtonClick: ReturnType<UseFormHandleSubmit<FormSchema>>
}

/** Presenter Component */
const ResetPasswordFormPresenter: React.VFC<PresenterProps> = ({
  disabled,
  loading,
  errors,
  fieldErrors,
  tokenErrorMsgs,
  register,
  onSubmitButtonClick,
  ...props
}) => (
  <Stack {...styles.root} {...props}>
    <AlertMessage error={tokenErrorMsgs} />
    <ErrorMessage error={errors} />
    <FormControl id='rp_password' isRequired isDisabled={disabled} isInvalid={hasValue(fieldErrors.password)}>
      <FormLabel>Password</FormLabel>
      <Input type='password' placeholder='password' {...styles.input} {...register('password')} />
      <FormErrorMessage>{fieldErrors.password?.message}</FormErrorMessage>
    </FormControl>
    <FormControl
      id='rp_passwordConfirm'
      isRequired
      isDisabled={disabled}
      isInvalid={hasValue(fieldErrors.passwordConfirm)}
    >
      <FormLabel>Password Confirm</FormLabel>
      <Input type='password' placeholder='password' {...styles.input} {...register('passwordConfirm')} />
      <FormErrorMessage>{fieldErrors.passwordConfirm?.message}</FormErrorMessage>
    </FormControl>
    <Stack>
      <Button {...styles.button} isLoading={loading} disabled={disabled} onClick={onSubmitButtonClick}>
        Submit
      </Button>
    </Stack>
  </Stack>
)

/** Container Component */
const ResetPasswordFormContainer: React.VFC<ContainerProps<ResetPasswordFormProps, PresenterProps>> = ({
  presenter,
  token,
  tokenErrors,
  mutation: { resetPassword },
  ...props
}) => {
  // react hook form
  const { register, handleSubmit, setError, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema)
  })

  // status
  const loading = resetPassword.loading
  const disabled = !isBlank(tokenErrors) || loading
  const fieldErrors = formState.errors
  const fields = Object.keys(schema.innerType().shape)
  const errors = useSetError<FormSchema>(fields, setError, resetPassword.errors)
  const tokenErrorMsgs = tokenErrors?.map((error) => getErrMsg(error.message))

  // mutate
  const resetPasswordMutation: SubmitHandler<FormSchema> = (input) => {
    resetPassword.reset()
    resetPassword.mutate({ variables: { input: { token: toStr(token), ...input } } }).catch(Toast('ValidationError'))
  }
  const onSubmitButtonClick = handleSubmit(resetPasswordMutation)

  return presenter({
    disabled,
    loading,
    errors,
    fieldErrors,
    tokenErrorMsgs,
    register,
    onSubmitButtonClick,
    ...props
  })
}

/** ResetPasswordForm */
export default connect<ResetPasswordFormProps, PresenterProps>(
  'ResetPasswordForm',
  ResetPasswordFormPresenter,
  ResetPasswordFormContainer
)
