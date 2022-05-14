import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Stack,
  Text
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import ErrorMessage from 'components/01_atoms/ErrorMessage'
import Modal, { ModalProps } from 'components/03_molecules/Modal'
import { connect } from 'components/hoc'
import { useSetError } from 'components/hooks'
import { ForgotPasswordMutation, ForgotPasswordMutationVariables } from 'graphql/generated'
import React, { useCallback, useMemo } from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'
import { hasValue } from 'utils/general/object'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** ForgotPasswordForm Props */
export type ForgotPasswordFormProps = Omit<ModalProps, 'children'> & {
  /**
   * Mutation
   */
  mutation: {
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
}

/** Presenter Props */
export type PresenterProps = Omit<ForgotPasswordFormProps, 'mutation'> & {
  loading: MutaionLoading
  errors: string[]
  fieldErrors: FieldErrors<FormSchema>
  register: UseFormRegister<FormSchema>
  onSubmitButtonClick: ReturnType<UseFormHandleSubmit<FormSchema>>
}

/** Presenter Component */
const ForgotPasswordFormPresenter: React.VFC<PresenterProps> = ({
  loading,
  errors,
  fieldErrors,
  register,
  onSubmitButtonClick,
  ...props
}) => (
  <Modal isCentered {...props}>
    <ModalContent>
      <ModalCloseButton isDisabled={loading} />
      <ModalBody py='5'>
        <Stack spacing='4'>
          <Heading {...styles.head}>Forgot your password?</Heading>
          <Text {...styles.text}>You will get an email with a link to reset your password.</Text>
          <ErrorMessage error={errors} />
          <FormControl id='fp_email' isDisabled={loading} isInvalid={hasValue(fieldErrors.email)}>
            <Input placeholder='your-email@example.com' type='email' {...styles.input} {...register('email')} />
            <FormErrorMessage>{fieldErrors.email?.message}</FormErrorMessage>
          </FormControl>
          <Button {...styles.button} isLoading={loading} onClick={onSubmitButtonClick}>
            Submit
          </Button>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const ForgotPasswordFormContainer: React.VFC<ContainerProps<ForgotPasswordFormProps, PresenterProps>> = ({
  presenter,
  isOpen,
  onClose: onFpfClose,
  mutation: { forgotPassword },
  ...props
}) => {
  // react hook form
  const { register, handleSubmit, setError, reset, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema)
  })

  // status
  const loading = forgotPassword.loading
  const fieldErrors = formState.errors
  const fields = Object.keys(schema.shape)
  const errors = useSetError<FormSchema>(fields, setError, forgotPassword.errors)

  // mutate
  const forgotPasswordMutation: SubmitHandler<FormSchema> = ({ email }) => {
    forgotPassword.reset()
    forgotPassword.mutate({ variables: { email } }).catch(console.log)
  }
  const onSubmitButtonClick = handleSubmit(forgotPasswordMutation)

  // modal onClose
  const onClose = useCallback(() => {
    onFpfClose()
    reset()
    forgotPassword.reset()
  }, [onFpfClose, reset, forgotPassword])

  useMemo(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  return presenter({
    isOpen,
    onClose,
    loading,
    errors,
    fieldErrors,
    register,
    onSubmitButtonClick,
    ...props
  })
}

/** ForgotPasswordForm */
export default connect<ForgotPasswordFormProps, PresenterProps>(
  'ForgotPasswordForm',
  ForgotPasswordFormPresenter,
  ForgotPasswordFormContainer
)
