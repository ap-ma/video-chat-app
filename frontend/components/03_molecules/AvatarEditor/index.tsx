import { SmallCloseIcon } from '@chakra-ui/icons'
import {
  Avatar,
  AvatarBadge,
  AvatarBadgeProps,
  AvatarProps,
  Button,
  ButtonProps,
  Center,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  IconButton,
  Input,
  InputProps,
  Stack,
  useMergeRefs
} from '@chakra-ui/react'
import { connectRef } from 'components/hoc'
import { ALLOWED_IMAGE_EXTS } from 'const'
import React, { forwardRef, Ref, useRef, useState } from 'react'
import { ContainerProps } from 'types'
import { fileToDataURL } from 'utils/general/helper'
import { isNullish } from 'utils/general/object'
import * as styles from './styles'

/** AvatarEditor Props */
export type AvatarEditorProps = Omit<InputProps, 'isDisabled'> &
  Partial<{
    /**
     * デフォルト画像
     */
    avatar: AvatarProps['src']
    /**
     * 非活性フラグ
     */
    isDisabled: boolean
    /**
     * エラーフラグ
     */
    isInvalid: FormControlProps['isInvalid']
    /**
     * エラーメッセージ
     */
    errorMessage: FormErrorMessageProps['children']
    /**
     * アバター編集時処理
     */
    onEdit: () => void
  }>

/** Presenter Props */
export type PresenterProps = Omit<AvatarEditorProps, 'value'> & {
  ref: Ref<HTMLInputElement>
  onAvatarChangeButtonClick: ButtonProps['onClick']
  clearAvatar: AvatarBadgeProps['onClick']
}

/** Presenter Component */
const AvatarEditorPresenter = forwardRef<HTMLInputElement, Omit<PresenterProps, 'ref'>>(
  ({ avatar, onAvatarChangeButtonClick, clearAvatar, isDisabled, isInvalid, errorMessage, ...props }, ref) => (
    <FormControl id='avatar' isInvalid={isInvalid}>
      <Stack {...styles.container}>
        <Center>
          <Avatar size='xl' src={avatar}>
            <AvatarBadge
              {...styles.badge({ isDisabled })}
              as={IconButton}
              icon={<SmallCloseIcon />}
              onClick={clearAvatar}
            />
          </Avatar>
        </Center>
        <Center w='full'>
          <Button w='full' disabled={isDisabled} onClick={onAvatarChangeButtonClick}>
            Change Avatar
          </Button>
          <Input {...styles.fileInput(ALLOWED_IMAGE_EXTS)} {...props} ref={ref} />
        </Center>
      </Stack>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  )
)

/** Container Component */
const AvatarEditorContainer = forwardRef<HTMLInputElement, ContainerProps<AvatarEditorProps, PresenterProps>>(
  ({ presenter, avatar, onChange, onEdit, ...props }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const onAvatarChangeButtonClick = () => fileInputRef.current?.click()
    const [avatarSrc, setAvatarSrc] = useState<AvatarEditorProps['avatar']>(avatar)

    const onAvatarChange: AvatarEditorProps['onChange'] = (event) => {
      if (!isNullish(onChange)) onChange(event)
      if (!isNullish(onEdit)) onEdit()

      const image = event.target.files?.item(0)
      if (isNullish(image)) {
        setAvatarSrc(undefined)
        return
      }

      fileToDataURL(image)
        .then((dataUrl) => setAvatarSrc(dataUrl))
        .catch(() => setAvatarSrc(undefined))
    }

    const clearAvatar = () => {
      if (!isNullish(onEdit)) onEdit()
      if (!isNullish(fileInputRef.current)) {
        fileInputRef.current.value = ''
        setAvatarSrc(undefined)
      }
    }

    return presenter({
      ref: useMergeRefs<HTMLInputElement>(ref, fileInputRef),
      avatar: avatarSrc,
      onAvatarChangeButtonClick,
      onChange: onAvatarChange,
      clearAvatar,
      ...props
    })
  }
)

// display name
AvatarEditorPresenter.displayName = 'AvatarEditorPresenter'
AvatarEditorContainer.displayName = 'AvatarEditorContainer'

/** AvatarEditor */
export default connectRef<HTMLInputElement, AvatarEditorProps, PresenterProps>(
  'AvatarEditor',
  AvatarEditorPresenter,
  AvatarEditorContainer
)
