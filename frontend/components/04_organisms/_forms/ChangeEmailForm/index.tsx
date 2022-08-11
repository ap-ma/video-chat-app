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
  Spinner,
  Stack,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import ErrorMessage from 'components/01_atoms/ErrorMessage'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import toast from 'components/01_atoms/Toast'
import { connect } from 'components/hoc'
import { useSetError } from 'components/hooks'
import { ChangeEmailMutation, ChangeEmailMutationVariables, MeQuery } from 'graphql/generated'
import React, { useCallback, useMemo } from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, QueryLoading, ValidationErrors } from 'types'
import { hasValue } from 'utils/general/object'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** ChangeEmailForm Props */
export type ChangeEmailFormProps = Omit<ModalProps, 'children'> & {
  /**
   * Query
   */
  query: {
    /**
     * ユーザー情報
     */
    me: {
      result?: MeQuery['me']
      loading: QueryLoading
    }
  }
  /**
   * Mutation
   */
  mutation: {
    /**
     * メールアドレス変更
     */
    changeEmail: {
      result?: ChangeEmailMutation['changeEmail']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ChangeEmailMutation, ChangeEmailMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ChangeEmailFormProps, 'mutation'> & {
  loading: MutaionLoading
  errors: string[]
  fieldErrors: FieldErrors<FormSchema>
  register: UseFormRegister<FormSchema>
  onSubmitButtonClick: ReturnType<UseFormHandleSubmit<FormSchema>>
}

/** Presenter Component */
const ChangeEmailFormPresenter: React.VFC<PresenterProps> = ({
  query: { me },
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
          <Heading {...styles.head}>Change Email</Heading>
          <ErrorMessage error={errors} />
          <Box>
            <Text {...styles.currentLabel}>Current Email</Text>
            <Text {...styles.currentText({ me })}>{me.result?.email}</Text>
            <Spinner {...styles.currentSpinner({ me })} />
          </Box>
          <FormControl id='ce_email' isDisabled={loading} isInvalid={hasValue(fieldErrors.email)}>
            <FormLabel>New Email</FormLabel>
            <Input type='email' placeholder='your-email@example.com' {...styles.input} {...register('email')} />
            <FormErrorMessage>{fieldErrors.email?.message}</FormErrorMessage>
          </FormControl>
          <Box pt='2'>
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
const ChangeEmailFormContainer: React.VFC<ContainerProps<ChangeEmailFormProps, PresenterProps>> = ({
  presenter,
  isOpen,
  onClose: onCefClose,
  mutation: { changeEmail },
  ...props
}) => {
  // modal prop isCentered
  const isCentered = useBreakpointValue({ base: true, sm: false })

  // react hook form
  const { register, handleSubmit, setError, reset, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema)
  })

  // status
  const loading = changeEmail.loading
  const fieldErrors = formState.errors
  const fields = Object.keys(schema.shape)
  const errors = useSetError<FormSchema>(fields, setError, changeEmail.errors)

  // mutate
  const changeEmailMutation: SubmitHandler<FormSchema> = ({ email }) => {
    changeEmail.reset()
    changeEmail.mutate({ variables: { email } }).catch(toast('ValidationError'))
  }

  // onClick submit button
  const onSubmitButtonClick = handleSubmit(changeEmailMutation)

  // modal onClose
  const onClose = useCallback(() => {
    onCefClose()
    reset()
    changeEmail.reset()
  }, [onCefClose, reset, changeEmail])

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

/** ChangeEmailForm */
export default connect<ChangeEmailFormProps, PresenterProps>(
  'ChangeEmailForm',
  ChangeEmailFormPresenter,
  ChangeEmailFormContainer
)
