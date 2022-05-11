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
  Stack
} from '@chakra-ui/react'
import composeRefs from '@seznam/compose-react-refs'
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
    avatar: AvatarProps['src']
    isDisabled: boolean
    isInvalid: FormControlProps['isInvalid']
    errorMessage: FormErrorMessageProps['children']
  }>

/** Presenter Props */
export type PresenterProps = Omit<AvatarEditorProps, 'value'> & {
  ref: Ref<HTMLInputElement>
  onAvatarChangeButtonClick: ButtonProps['onClick']
  clearAvatar: AvatarBadgeProps['onClick']
}

/** Presenter Component */
const AvatarEditorPresenter = forwardRef<HTMLInputElement, PresenterProps>(
  ({ avatar, onAvatarChangeButtonClick, clearAvatar, isDisabled, isInvalid, errorMessage, ...props }, ref) => (
    <FormControl id='avatar' isInvalid={isInvalid}>
      <Stack {...styles.container}>
        <Center>
          <Avatar size='xl' src={avatar}>
            <AvatarBadge
              {...styles.badge}
              as={IconButton}
              icon={<SmallCloseIcon />}
              disabled={isDisabled}
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
  ({ presenter, avatar, onChange, ...props }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const onAvatarChangeButtonClick = () => fileInputRef.current?.click()
    const [avatarSrc, setAvatarSrc] = useState<AvatarEditorProps['avatar']>(avatar)

    const onChangeAvatar: AvatarEditorProps['onChange'] = (event) => {
      if (!isNullish(onChange)) onChange(event)

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
      if (!isNullish(fileInputRef.current)) {
        fileInputRef.current.value = ''
        setAvatarSrc(undefined)
      }
    }

    return presenter({
      ref: composeRefs<HTMLInputElement>(ref, fileInputRef),
      avatar: avatarSrc,
      onAvatarChangeButtonClick,
      onChange: onChangeAvatar,
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
