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
  Tooltip
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import AlertMessage from 'components/01_atoms/AlertMessage'
import AvatarEditor from 'components/03_molecules/AvatarEditor'
import Modal, { ModalProps } from 'components/03_molecules/Modal'
import { connect } from 'components/hoc'
import { useSetError } from 'components/hooks'
import { VALIDATION_USER_COMMENT_MAX_LEN } from 'const'
import { EditProfileMutation, EditProfileMutationVariables, MeQuery } from 'graphql/generated'
import React, { useCallback } from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'
import { imageCompression } from 'utils/general/helper'
import { hasValue, isNullish } from 'utils/general/object'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** EditProfileForm Props */
export type EditProfileFormProps = Omit<ModalProps, 'children'> & {
  /**
   * サインインユーザー情報
   */
  me?: MeQuery['me']
  /**
   * Mutation
   */
  mutation: {
    /**
     * プロフィール編集
     */
    editProfile: {
      result?: EditProfileMutation['editProfile']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<EditProfileMutation, EditProfileMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<EditProfileFormProps, 'mutation'> & {
  loading: MutaionLoading
  errors: string[]
  fieldErrors: FieldErrors<FormSchema>
  register: UseFormRegister<FormSchema>
  onSignUpButtonClick: ReturnType<UseFormHandleSubmit<FormSchema>>
}

/** Presenter Component */
const EditProfileFormPresenter: React.VFC<PresenterProps> = ({
  loading,
  errors,
  fieldErrors,
  register,
  onSignUpButtonClick,
  ...props
}) => (
  <Modal {...props}>
    <ModalContent>
      <ModalCloseButton isDisabled={loading} />
      <ModalBody pt='5' pb='8'>
        <Stack spacing='4'>
          <Heading {...styles.head}>Sign up</Heading>
          <AlertMessage error={errors} />
          <AvatarEditor
            {...register('avatar')}
            isDisabled={loading}
            isInvalid={hasValue(fieldErrors.avatar)}
            errorMessage={fieldErrors.avatar?.message}
          />
          <Stack {...styles.identifier}>
            <Box w='full'>
              <FormControl id='su_code' isRequired isDisabled={loading} isInvalid={hasValue(fieldErrors.code)}>
                <FormLabel>Code</FormLabel>
                <Tooltip label='Code for friends to find you.' {...styles.tooltip}>
                  <Input type='text' placeholder='code' {...styles.input} {...register('code')} />
                </Tooltip>
                <FormErrorMessage>{fieldErrors.code?.message}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box w='full'>
              <FormControl id='su_name' isRequired isDisabled={loading} isInvalid={hasValue(fieldErrors.name)}>
                <FormLabel>Nickname</FormLabel>
                <Tooltip label='Your Nickname.' {...styles.tooltip}>
                  <Input type='text' placeholder='nickname' {...styles.input} {...register('name')} />
                </Tooltip>
                <FormErrorMessage>{fieldErrors.name?.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </Stack>
          <FormControl id='su_email' isRequired isDisabled={loading} isInvalid={hasValue(fieldErrors.email)}>
            <FormLabel>Email address</FormLabel>
            <Tooltip label='Sign in Email Address.' {...styles.tooltip}>
              <Input type='email' placeholder='your-email@example.com' {...styles.input} {...register('email')} />
            </Tooltip>
            <FormErrorMessage>{fieldErrors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id='su_password' isRequired isDisabled={loading} isInvalid={hasValue(fieldErrors.password)}>
            <FormLabel>Password</FormLabel>
            <Tooltip label='Sign in Password.' {...styles.tooltip}>
              <Input type='password' placeholder='password' {...styles.input} {...register('password')} />
            </Tooltip>
            <FormErrorMessage>{fieldErrors.password?.message}</FormErrorMessage>
          </FormControl>
          <FormControl
            id='su_passwordConfirm'
            isRequired
            isDisabled={loading}
            isInvalid={hasValue(fieldErrors.passwordConfirm)}
          >
            <FormLabel>Confirm Password</FormLabel>
            <Tooltip label='Enter the Password again for confirmation.' {...styles.tooltip}>
              <Input type='password' placeholder='password' {...styles.input} {...register('passwordConfirm')} />
            </Tooltip>
            <FormErrorMessage>{fieldErrors.passwordConfirm?.message}</FormErrorMessage>
          </FormControl>
          <FormControl id='su_comment' isDisabled={loading} isInvalid={hasValue(fieldErrors.comment)}>
            <FormLabel>Comment</FormLabel>
            <Tooltip label='Status Message.' {...styles.tooltip}>
              <Input type='text' placeholder='comment...' {...styles.input} {...register('comment')} />
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
const EditProfileFormContainer: React.VFC<ContainerProps<EditProfileFormProps, PresenterProps>> = ({
  presenter,
  isOpen,
  onClose: onSufClose,
  mutation: { editProfile },
  ...props
}) => {
  // react hook form
  const { register, handleSubmit, setError, reset, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema)
  })

  // status
  const loading = editProfile.loading
  const fieldErrors = formState.errors
  const fields = Object.keys(schema.innerType().shape)
  const errors = useSetError<FormSchema>(fields, setError, editProfile.errors, {
    comment: { vml_length: VALIDATION_USER_COMMENT_MAX_LEN }
  })

  // mutate
  const signUpMutation: SubmitHandler<FormSchema> = (input) => {
    editProfile.reset()
    const avatar = (input.avatar as FileList).item(0)
    const compressed = isNullish(avatar) ? Promise.resolve(undefined) : imageCompression(avatar)
    const mutate = (avatar?: unknown) =>
      editProfile.mutate({ variables: { input: { ...input, avatar: avatar instanceof File ? avatar : undefined } } })
    compressed.then(mutate, mutate).catch(console.log)
  }
  const onSignUpButtonClick = handleSubmit(signUpMutation)

  // modal onClose
  const onClose = useCallback(() => {
    onSufClose()
    reset()
    editProfile.reset()
  }, [onSufClose, reset, editProfile])

  return presenter({
    isOpen,
    onClose,
    loading,
    errors,
    fieldErrors,
    register,
    onSignUpButtonClick,
    ...props
  })
}

/** EditProfileForm */
export default connect<EditProfileFormProps, PresenterProps>(
  'EditProfileForm',
  EditProfileFormPresenter,
  EditProfileFormContainer
)
