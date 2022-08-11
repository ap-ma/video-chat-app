import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Stack,
  useBreakpointValue
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import ErrorMessage from 'components/01_atoms/ErrorMessage'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import toast from 'components/01_atoms/Toast'
import { connect } from 'components/hoc'
import { useSetError } from 'components/hooks'
import { ChangePasswordMutation, ChangePasswordMutationVariables } from 'graphql/generated'
import React, { useCallback, useMemo } from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'
import { hasValue } from 'utils/general/object'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** ChangePasswordForm Props */
export type ChangePasswordFormProps = Omit<ModalProps, 'children'> & {
  /**
   * Mutation
   */
  mutation: {
    /**
     * パスワード変更
     */
    changePassword: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ChangePasswordMutation, ChangePasswordMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ChangePasswordFormProps, 'mutation'> & {
  loading: MutaionLoading
  errors: string[]
  fieldErrors: FieldErrors<FormSchema>
  register: UseFormRegister<FormSchema>
  onSubmitButtonClick: ReturnType<UseFormHandleSubmit<FormSchema>>
}

/** Presenter Component */
const ChangePasswordFormPresenter: React.VFC<PresenterProps> = ({
  loading,
  errors,
  fieldErrors,
  register,
  onSubmitButtonClick,
  ...props
}) => (
  <Modal {...props}>
    <ModalContent {...styles.content}>
      <ModalCloseButton isDisabled={loading} />
      <ModalBody pt='5' pb='6'>
        <Stack spacing='4'>
          <Heading {...styles.head}>Change Password</Heading>
          <ErrorMessage error={errors} />
          <FormControl id='cp_password' isRequired isDisabled={loading} isInvalid={hasValue(fieldErrors.password)}>
            <FormLabel>Password</FormLabel>
            <Input type='password' placeholder='password' {...styles.input} {...register('password')} />
            <FormErrorMessage>{fieldErrors.password?.message}</FormErrorMessage>
          </FormControl>
          <FormControl
            id='cp_newPassword'
            isRequired
            isDisabled={loading}
            isInvalid={hasValue(fieldErrors.newPassword)}
          >
            <FormLabel>New Password</FormLabel>
            <Input type='password' placeholder='new password' {...styles.input} {...register('newPassword')} />
            <FormErrorMessage>{fieldErrors.newPassword?.message}</FormErrorMessage>
          </FormControl>
          <FormControl
            id='cp_newPasswordConfirm'
            isRequired
            isDisabled={loading}
            isInvalid={hasValue(fieldErrors.newPasswordConfirm)}
          >
            <FormLabel>New Password Confirm</FormLabel>
            <Input type='password' placeholder='new password' {...styles.input} {...register('newPasswordConfirm')} />
            <FormErrorMessage>{fieldErrors.newPasswordConfirm?.message}</FormErrorMessage>
          </FormControl>
          <Box pt='3'>
            <Button {...styles.button} isLoading={loading} onClick={onSubmitButtonClick}>
              Submit
            </Button>
          </Box>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const ChangePasswordFormContainer: React.VFC<ContainerProps<ChangePasswordFormProps, PresenterProps>> = ({
  presenter,
  isOpen,
  onClose: onCpfClose,
  mutation: { changePassword },
  ...props
}) => {
  // modal prop isCentered
  const isCentered = useBreakpointValue({ base: true, sm: false })

  // react hook form
  const { register, handleSubmit, setError, reset, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema)
  })

  // status
  const loading = changePassword.loading
  const fieldErrors = formState.errors
  const fields = Object.keys(schema.innerType().shape)
  const errors = useSetError<FormSchema>(fields, setError, changePassword.errors)

  // mutate
  const changePasswordMutation: SubmitHandler<FormSchema> = (input) => {
    changePassword.reset()
    changePassword.mutate({ variables: { input } }).catch(toast('ValidationError'))
  }

  // onClick submit button
  const onSubmitButtonClick = handleSubmit(changePasswordMutation)

  // modal onClose
  const onClose = useCallback(() => {
    onCpfClose()
    reset()
    changePassword.reset()
  }, [onCpfClose, reset, changePassword])

  useMemo(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  return presenter({
    isCentered,
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

/** ChangePasswordForm */
export default connect<ChangePasswordFormProps, PresenterProps>(
  'ChangePasswordForm',
  ChangePasswordFormPresenter,
  ChangePasswordFormContainer
)
