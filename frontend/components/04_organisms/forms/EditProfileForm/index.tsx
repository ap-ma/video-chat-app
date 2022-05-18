import {
  Box,
  Button,
  ButtonProps,
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
import Editable from 'components/01_atoms/Editable'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import toast from 'components/01_atoms/Toast'
import AvatarEditor, { AvatarEditorProps } from 'components/03_molecules/AvatarEditor'
import { connect } from 'components/hoc'
import { useSetError } from 'components/hooks'
import { VALIDATION_USER_COMMENT_MAX_LEN } from 'const'
import { EditProfileMutation, EditProfileMutationVariables, MeQuery } from 'graphql/generated'
import { nanoid } from 'nanoid'
import React, { useCallback, useMemo, useState } from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'
import { imageCompression, toStr } from 'utils/general/helper'
import { hasValue, isNullish } from 'utils/general/object'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** EditProfileForm Props */
export type EditProfileFormProps = Omit<ModalProps, 'children'> & {
  /**
   * Query
   */
  query: {
    /**
     * サインインユーザー情報
     */
    me: {
      result?: MeQuery['me']
    }
  }
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
export type PresenterProps = Omit<EditProfileFormProps, 'query' | 'mutation'> & {
  avatar: AvatarEditorProps['avatar']
  avatarEditorKey: string
  edit: boolean
  loading: MutaionLoading
  errors: string[]
  fieldErrors: FieldErrors<FormSchema>
  register: UseFormRegister<FormSchema>
  onAvatarEdit: AvatarEditorProps['onEdit']
  onEditButtonClick: ButtonProps['onClick']
  onCancelButtonClick: ButtonProps['onClick']
  onSaveButtonClick: ReturnType<UseFormHandleSubmit<FormSchema>>
}

/** Presenter Component */
const EditProfileFormPresenter: React.VFC<PresenterProps> = ({
  avatar,
  avatarEditorKey,
  edit,
  loading,
  errors,
  fieldErrors,
  register,
  onAvatarEdit,
  onEditButtonClick,
  onCancelButtonClick,
  onSaveButtonClick,
  ...props
}) => (
  <Modal isCentered {...props}>
    <ModalContent>
      <ModalCloseButton isDisabled={loading} />
      <ModalBody pt='5' pb='8'>
        <Stack spacing='4'>
          <Heading {...styles.head}>Edit Profile</Heading>
          <AlertMessage error={errors} />
          <AvatarEditor
            avatar={avatar}
            isDisabled={!edit || loading}
            isInvalid={hasValue(fieldErrors.avatar)}
            errorMessage={fieldErrors.avatar?.message}
            onEdit={onAvatarEdit}
            key={avatarEditorKey}
            {...register('avatar')}
          />
          <Input type='hidden' {...register('isAvatarEdited')} />
          <Stack {...styles.identifier}>
            <Box w='full'>
              <FormControl id='ep_code' isRequired={edit} isDisabled={loading} isInvalid={hasValue(fieldErrors.code)}>
                <FormLabel>Code</FormLabel>
                <Tooltip label='Code for friends to find you.' {...styles.tooltip({ edit })}>
                  <Editable type='text' placeholder='code' {...styles.input} isEditable={edit} {...register('code')} />
                </Tooltip>
                <FormErrorMessage>{fieldErrors.code?.message}</FormErrorMessage>
              </FormControl>
            </Box>
            <Box w='full'>
              <FormControl id='ep_name' isRequired={edit} isDisabled={loading} isInvalid={hasValue(fieldErrors.name)}>
                <FormLabel>Nickname</FormLabel>
                <Tooltip label='Your Nickname.' {...styles.tooltip({ edit })}>
                  <Editable
                    type='text'
                    placeholder='nickname'
                    {...styles.input}
                    isEditable={edit}
                    {...register('name')}
                  />
                </Tooltip>
                <FormErrorMessage>{fieldErrors.name?.message}</FormErrorMessage>
              </FormControl>
            </Box>
          </Stack>
          <FormControl id='ep_comment' isDisabled={loading} isInvalid={hasValue(fieldErrors.comment)}>
            <FormLabel>Comment</FormLabel>
            <Tooltip label='Status Message.' {...styles.tooltip({ edit })}>
              <Editable
                type='text'
                placeholder='comment...'
                {...styles.input}
                isEditable={edit}
                {...register('comment')}
              />
            </Tooltip>
            <FormErrorMessage>{fieldErrors.comment?.message}</FormErrorMessage>
          </FormControl>
          <Stack {...styles.actions}>
            <Button {...styles.editButton({ edit })} onClick={onEditButtonClick}>
              Edit
            </Button>
            <Button {...styles.cancelButton({ edit })} isDisabled={loading} onClick={onCancelButtonClick}>
              Cancel
            </Button>
            <Button {...styles.saveButton({ edit })} isLoading={loading} onClick={onSaveButtonClick}>
              Save
            </Button>
          </Stack>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const EditProfileFormContainer: React.VFC<ContainerProps<EditProfileFormProps, PresenterProps>> = ({
  presenter,
  query: { me },
  onClose: onEpfClose,
  mutation: { editProfile },
  ...props
}) => {
  // state
  const [edit, setEdit] = useState(false)
  const [avatarEditorKey, setAvatarEditorKey] = useState(nanoid())

  // default values
  const defaultValues = useMemo(() => {
    return {
      code: me.result?.code ?? undefined,
      name: me.result?.name ?? undefined,
      comment: me.result?.comment ?? undefined,
      isAvatarEdited: false
    }
  }, [me.result])

  // react hook form
  const { register, handleSubmit, setValue, setError, reset, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues
  })

  // status
  const loading = editProfile.loading
  const fieldErrors = formState.errors
  const fields = Object.keys(schema.shape)
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
    compressed.then(mutate, mutate).catch(toast('ValidationError'))
  }

  // onAvatarEdit
  const onAvatarEdit: AvatarEditorProps['onEdit'] = () => {
    setValue('isAvatarEdited', true)
  }

  // onClick edit button
  const onEditButtonClick = () => {
    setEdit(true)
  }

  // onClick cancel button
  const onCancelButtonClick = useCallback(() => {
    setEdit(false)
    setAvatarEditorKey(nanoid())
    reset(defaultValues)
  }, [reset, defaultValues])

  // onClick save button
  const onSaveButtonClick = handleSubmit(signUpMutation)

  // mutate onComplete
  useMemo(() => {
    if (hasValue(editProfile.result)) {
      editProfile.reset()
      onCancelButtonClick()
      toast('EditProfileComplete')()
    }
  }, [editProfile, onCancelButtonClick])

  // modal onClose
  const onClose = useCallback(() => {
    onEpfClose()
    editProfile.reset()
    onCancelButtonClick()
  }, [onEpfClose, editProfile, onCancelButtonClick])

  return presenter({
    avatar: toStr(me.result?.avatar),
    avatarEditorKey,
    edit,
    onClose,
    loading,
    errors,
    fieldErrors,
    register,
    onAvatarEdit,
    onEditButtonClick,
    onCancelButtonClick,
    onSaveButtonClick,
    ...props
  })
}

/** EditProfileForm */
export default connect<EditProfileFormProps, PresenterProps>(
  'EditProfileForm',
  EditProfileFormPresenter,
  EditProfileFormContainer
)
