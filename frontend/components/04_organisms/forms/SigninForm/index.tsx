import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Stack,
  StackProps
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import ErrorMessage from 'components/01_atoms/ErrorMessage'
import { connect } from 'components/hoc'
import { useSetError } from 'components/hooks'
import { SignInMutation, SignInMutationVariables } from 'graphql/generated'
import React from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, OnOpen, ValidationErrors } from 'types'
import { hasValue } from 'utils/general/object'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** SigninForm Props */
export type SigninFormProps = StackProps & {
  /**
   * パスワード忘れモーダル onOpen
   */
  onFpfOpen: OnOpen
  /**
   * Mutation
   */
  mutation: {
    /**
     * サインイン
     */
    signIn: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<SignInMutation, SignInMutationVariables>
    }
  }
}

/** Presenter Props */
type PresenterProps = Omit<SigninFormProps, 'mutation'> & {
  loading: MutaionLoading
  errors: string[]
  fieldErrors: FieldErrors<FormSchema>
  register: UseFormRegister<FormSchema>
  onSignInButtonClick: ReturnType<UseFormHandleSubmit<FormSchema>>
}

/** Presenter Component */
const SigninFormPresenter: React.VFC<PresenterProps> = ({
  onFpfOpen,
  loading,
  errors,
  fieldErrors,
  register,
  onSignInButtonClick,
  ...props
}) => (
  <Stack {...styles.root} {...props}>
    <ErrorMessage error={errors} />
    <FormControl id='email' isDisabled={loading} isInvalid={hasValue(fieldErrors.email)}>
      <FormLabel>Email address</FormLabel>
      <Input type='email' {...styles.input} {...register('email')} />
      <FormErrorMessage>{fieldErrors.email?.message}</FormErrorMessage>
    </FormControl>
    <FormControl id='password' isDisabled={loading} isInvalid={hasValue(fieldErrors.password)}>
      <FormLabel>Password</FormLabel>
      <Input type='password' {...styles.input} {...register('password')} />
      <FormErrorMessage>{fieldErrors.password?.message}</FormErrorMessage>
    </FormControl>
    <Stack spacing='10'>
      <Stack {...styles.options}>
        <Checkbox isDisabled={loading} {...register('rememberMe')}>
          Remember me
        </Checkbox>
        <Link {...styles.link(loading)} onClick={onFpfOpen}>
          Forgot password?
        </Link>
      </Stack>
      <Button {...styles.signinButton} isLoading={loading} onClick={onSignInButtonClick}>
        Sign in
      </Button>
    </Stack>
  </Stack>
)

/** Container Component */
const SigninFormContainer: React.VFC<ContainerProps<SigninFormProps, PresenterProps>> = ({
  presenter,
  mutation: { signIn },
  ...props
}) => {
  // react hook form
  const { register, handleSubmit, setError, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema)
  })

  // status
  const loading = signIn.loading
  const fieldErrors = formState.errors
  const fields = Object.keys(schema.shape)
  const errors = useSetError<FormSchema>(fields, setError, signIn.errors)

  // mutate
  const signInMutation: SubmitHandler<FormSchema> = (input) => {
    signIn.reset()
    signIn.mutate({ variables: { input } }).catch(console.log)
  }
  const onSignInButtonClick = handleSubmit(signInMutation)

  return presenter({
    loading,
    errors,
    fieldErrors,
    register,
    onSignInButtonClick,
    ...props
  })
}

/** SigninForm */
export default connect<SigninFormProps, PresenterProps>('SigninForm', SigninFormPresenter, SigninFormContainer)
