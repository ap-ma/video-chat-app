import { IconButton, IconButtonProps, Input, InputProps, useBreakpointValue, useDisclosure } from '@chakra-ui/react'
import SendImageConfirmDialog, {
  SendImageConfirmDialogProps
} from 'components/04_organisms/_dialogs/SendImageConfirmDialog'
import { connect } from 'components/hoc'
import { ALLOWED_IMAGE_EXTS } from 'const'
import { ContactInfoQuery, SendImageMutation, SendImageMutationVariables } from 'graphql/generated'
import React, { Fragment, Ref, useCallback, useMemo, useRef } from 'react'
import { AiOutlineFileImage } from 'react-icons/ai'
import {
  ContainerProps,
  Disclosure,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  Optional,
  QueryNetworkStatus,
  ValidationErrors
} from 'types'
import { hasValue, isNullish } from 'utils/general/object'
import * as styles from './styles'

/** SendImageIcon Props */
export type SendImageIconProps = Optional<IconButtonProps, 'aria-label'> & {
  /**
   * Query
   */
  query: {
    /**
     *  コンタクト情報
     */
    contactInfo: {
      result?: ContactInfoQuery['contactInfo']
      networkStatus: QueryNetworkStatus
    }
  }
  /**
   * Mutation
   */
  mutation: {
    /**
     * 画像送信
     */
    sendImage: {
      result?: SendImageMutation['sendImage']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<SendImageMutation, SendImageMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = SendImageIconProps & {
  fileInputRef: Ref<HTMLInputElement>
  sicdDisc: Disclosure
  isCentered: SendImageConfirmDialogProps['isCentered']
  image: SendImageConfirmDialogProps['image']
  onImageIconClick: IconButtonProps['onClick']
  onImageChange: InputProps['onChange']
}

/** Presenter Component */
const SendImageIconPresenter: React.VFC<PresenterProps> = ({
  query,
  mutation,
  fileInputRef,
  sicdDisc,
  isCentered,
  image,
  onImageIconClick,
  onImageChange,
  ...props
}) => (
  <Fragment>
    <IconButton
      icon={<AiOutlineFileImage />}
      {...styles.imageIcon}
      aria-label='send image'
      onClick={onImageIconClick}
      {...props}
    />
    <Input {...styles.fileInput(ALLOWED_IMAGE_EXTS)} ref={fileInputRef} onChange={onImageChange} />
    <SendImageConfirmDialog
      {...{ isCentered, query, mutation, image }}
      isOpen={sicdDisc.isOpen}
      onClose={sicdDisc.onClose}
    />
  </Fragment>
)

/** Container Component */
const SendImageIconContainer: React.VFC<ContainerProps<SendImageIconProps, PresenterProps>> = ({
  presenter,
  mutation: { sendImage },
  ...props
}) => {
  // modal prop isCentered
  const isCentered = useBreakpointValue({ base: true, sm: false })

  // SendImageConfirmDialog modal
  const { onClose: onSicdClose, ...sicdDiscRest } = useDisclosure()

  // file input
  const fileInputRef = useRef<HTMLInputElement>(null)
  const image = fileInputRef.current?.files?.item(0)
  const onImageIconClick = () => fileInputRef.current?.click()

  // SendImageConfirmDialog onClose
  const onClose = useCallback(() => {
    onSicdClose()
    const input = fileInputRef.current
    if (!isNullish(input)) input.value = ''
  }, [onSicdClose])

  // SendImageConfirmDialog useDisclosure
  const sicdDisc = useMemo(() => {
    return { onClose, ...sicdDiscRest }
  }, [onClose, sicdDiscRest])

  // file onChange
  const onImageChange: PresenterProps['onImageChange'] = (event) => {
    const image = event.target.files?.item(0)
    if (!isNullish(image)) sicdDisc.onOpen()
  }

  // mutate onComplete
  useMemo(() => {
    if (hasValue(sendImage.result)) onClose()
  }, [onClose, sendImage.result])

  return presenter({
    mutation: { sendImage },
    fileInputRef,
    sicdDisc,
    isCentered,
    image,
    onImageIconClick,
    onImageChange,
    ...props
  })
}

/** SendImageIcon */
export default connect<SendImageIconProps, PresenterProps>(
  'SendImageIcon',
  SendImageIconPresenter,
  SendImageIconContainer
)
