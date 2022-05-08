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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Stack,
  Tooltip
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import AvatarEditor from 'components/03_molecules/AvatarEditor'
import { connect } from 'components/hoc'
import { SignUpMutation, SignUpMutationVariables } from 'graphql/generated'
import React from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'
import { hasValue } from 'utils/general/object'
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
const Presenter: React.VFC<PresenterProps> = ({
  register,
  onSignUpButtonClick,
  loading,
  errors,
  fieldErrors,
  ...props
}) => (
  <Modal {...styles.root} {...props}>
    <ModalOverlay {...styles.overlay} />
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
            <FormLabel>Email</FormLabel>
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
const Container: React.VFC<ContainerProps<SignupFormProps, PresenterProps>> = ({ presenter, signUp, ...props }) => {
  const { register, handleSubmit, setError, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema)
  })

  const signUpMutation: SubmitHandler<FormSchema> = (input) => {
    signUp.reset()
    const avatar = (input.avatar as FileList).item(0)
    signUp.mutate({ variables: { input: { ...input, avatar } } })
  }
  const onSignUpButtonClick = handleSubmit(signUpMutation)

  const loading = signUp.loading
  const errors = setGqlErrorsToFieldErrors(schema.innerType().shape, signUp.errors, setError)
  const fieldErrors = formState.errors

  return presenter({ register, onSignUpButtonClick, loading, errors, fieldErrors, ...props })
}

/** SignupForm */
export default connect<SignupFormProps, PresenterProps>('SignupForm', Presenter, Container)
