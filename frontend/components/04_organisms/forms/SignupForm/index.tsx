import {
  Alert,
  AlertIcon,
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
  Tooltip
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import AvatarEditor from 'components/03_molecules/AvatarEditor'
import Modal, { ModalProps } from 'components/03_molecules/Modal'
import { connect } from 'components/hoc'
import { VALIDATION_USER_COMMENT_MAX_LEN } from 'const'
import { SignUpMutation, SignUpMutationVariables } from 'graphql/generated'
import React, { useCallback, useMemo } from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'
import { imageCompression } from 'utils/general/helper'
import { hasValue, isNullish } from 'utils/general/object'
import { setGqlErrorsToFieldErrors } from 'utils/helper'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** SignupForm Props */
export type SignupFormProps = Omit<ModalProps, 'children'> & {
  /**
   * サインアップ
   */
  signUp: {
    result?: SignUpMutation['signUp']
    loading: MutaionLoading
    errors?: ValidationErrors
    reset: MutaionReset
    mutate: MutateFunction<SignUpMutation, SignUpMutationVariables>
  }
}

/** Presenter Props */
type PresenterProps = Omit<SignupFormProps, 'signUp'> & {
  register: UseFormRegister<FormSchema>
  onSignUpButtonClick: ReturnType<UseFormHandleSubmit<FormSchema>>
  loading: MutaionLoading
  errors: string[]
  fieldErrors: FieldErrors<FormSchema>
}

/** Presenter Component */
const SignupFormPresenter: React.VFC<PresenterProps> = ({
  register,
  onSignUpButtonClick,
  loading,
  errors,
  fieldErrors,
  ...props
}) => (
  <Modal {...props}>
    <ModalContent>
      <ModalCloseButton isDisabled={loading} />
      <ModalBody pt='5' pb='8'>
        <Stack spacing='4'>
          <Heading {...styles.head}>Sign up</Heading>
          {errors?.map((msg, i) => (
            <Alert status='error' rounded='lg' key={i}>
              <AlertIcon /> {msg}
            </Alert>
          ))}
          <AvatarEditor
            {...register('avatar')}
            isDisabled={loading}
            isInvalid={hasValue(fieldErrors.avatar)}
            errorMessage={fieldErrors.avatar?.message}
          />
          <Stack {...styles.identifier}>
            <Box w='full'>
              <FormControl id='code' isRequired isDisabled={loading} isInvalid={hasValue(fieldErrors.code)}>
                <FormLabel>Code</FormLabel>
                <Tooltip label='Code for friends to find you.' {...styles.tooltip}>
                  <Input placeholder='code' type='text' {...styles.input} {...register('code')} />
                </Tooltip>
                <FormErrorMessage>{fieldErrors.code?.message}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box w='full'>
              <FormControl id='name' isRequired isDisabled={loading} isInvalid={hasValue(fieldErrors.name)}>
                <FormLabel>Nickname</FormLabel>
                <Tooltip label='Your Nickname.' {...styles.tooltip}>
                  <Input placeholder='nickname' type='text' {...styles.input} {...register('name')} />
                </Tooltip>
                <FormErrorMessage>{fieldErrors.name?.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </Stack>
          <FormControl id='email' isRequired isDisabled={loading} isInvalid={hasValue(fieldErrors.email)}>
            <FormLabel>Email address</FormLabel>
            <Tooltip label='Sign in Email Address.' {...styles.tooltip}>
              <Input placeholder='your-email@example.com' type='email' {...styles.input} {...register('email')} />
            </Tooltip>
            <FormErrorMessage>{fieldErrors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id='password' isRequired isDisabled={loading} isInvalid={hasValue(fieldErrors.password)}>
            <FormLabel>Password</FormLabel>
            <Tooltip label='Sign in Password.' {...styles.tooltip}>
              <Input placeholder='password' type='password' {...styles.input} {...register('password')} />
            </Tooltip>
            <FormErrorMessage>{fieldErrors.password?.message}</FormErrorMessage>
          </FormControl>
          <FormControl
            id='passwordConfirm'
            isRequired
            isDisabled={loading}
            isInvalid={hasValue(fieldErrors.passwordConfirm)}
          >
            <FormLabel>Confirm Password</FormLabel>
            <Tooltip label='Enter the Password again for confirmation.' {...styles.tooltip}>
              <Input placeholder='password' type='password' {...styles.input} {...register('passwordConfirm')} />
            </Tooltip>
            <FormErrorMessage>{fieldErrors.passwordConfirm?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id='comment' isDisabled={loading} isInvalid={hasValue(fieldErrors.comment)}>
            <FormLabel>Comment</FormLabel>
            <Tooltip label='Status Message.' {...styles.tooltip}>
              <Input placeholder='comment...' type='input' {...styles.input} {...register('comment')} />
            </Tooltip>
            <FormErrorMessage>{fieldErrors.comment?.message}</FormErrorMessage>
          </FormControl>
          <Box pt='4'>
            <Button {...styles.signupButton} isLoading={loading} onClick={onSignUpButtonClick}>
              Sign up
            </Button>
          </Box>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const SignupFormContainer: React.VFC<ContainerProps<SignupFormProps, PresenterProps>> = ({
  presenter,
  signUp,
  isOpen,
  onClose: onSufClose,
  ...props
}) => {
  // react hook form
  const { register, handleSubmit, setError, reset, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema)
  })

  // status
  const loading = signUp.loading
  const fieldErrors = formState.errors
  const fields = Object.keys(schema.innerType().shape)
  const errors = setGqlErrorsToFieldErrors<FormSchema>(fields, setError, signUp.errors, {
    comment: { vml_length: VALIDATION_USER_COMMENT_MAX_LEN }
  })

  // mutate
  const signUpMutation: SubmitHandler<FormSchema> = (input) => {
    signUp.reset()
    const avatar = (input.avatar as FileList).item(0)
    const compressed = isNullish(avatar) ? Promise.resolve(undefined) : imageCompression(avatar)
    compressed
      .then((avatar) => signUp.mutate({ variables: { input: { ...input, avatar } } }))
      .catch(() => signUp.mutate({ variables: { input: { ...input, avatar: undefined } } }))
  }
  const onSignUpButtonClick = handleSubmit(signUpMutation)

  // modal onClose
  const onClose = useCallback(() => {
    onSufClose()
    reset()
    signUp.reset()
  }, [onSufClose, reset, signUp])

  useMemo(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  return presenter({
    register,
    onSignUpButtonClick,
    loading,
    errors,
    fieldErrors,
    isOpen,
    onClose,
    ...props
  })
}

/** SignupForm */
export default connect<SignupFormProps, PresenterProps>('SignupForm', SignupFormPresenter, SignupFormContainer)
