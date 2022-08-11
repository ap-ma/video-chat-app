import {
  Button,
  ButtonProps,
  Image,
  ImageProps,
  ModalBody,
  ModalContent,
  Stack,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import AlertMessage from 'components/01_atoms/AlertMessage'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import toast from 'components/01_atoms/Toast'
import { connect } from 'components/hoc'
import { ContactInfoQuery, SendImageMutation, SendImageMutationVariables } from 'graphql/generated'
import React, { useCallback, useMemo, useState } from 'react'
import {
  ContainerProps,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryNetworkStatus,
  ValidationErrors
} from 'types'
import { fileToDataURL, imageCompression, toStr } from 'utils/general/helper'
import { isBlank, isNullish } from 'utils/general/object'
import { getErrMsg, isAllowedImageFile } from 'utils/helper'
import * as styles from './styles'

/** SendImageConfirmDialog Props */
export type SendImageConfirmDialogProps = Omit<ModalProps, 'children'> & {
  /**
   * 画像ファイル
   */
  image: File | null | undefined
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
export type PresenterProps = Omit<SendImageConfirmDialogProps, 'image' | 'query' | 'mutation'> & {
  imageSrc: ImageProps['src']
  isInvalid: boolean
  loading: MutaionLoading
  errors: string[]
  onOkButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const SendImageConfirmDialogPresenter: React.VFC<PresenterProps> = ({
  onClose,
  imageSrc,
  isInvalid,
  loading,
  errors,
  onOkButtonClick,
  ...props
}) => (
  <Modal {...{ onClose, ...props }}>
    <ModalContent {...styles.content}>
      <ModalBody py='5'>
        <AlertMessage error={errors} />
        <Text {...styles.text({ isInvalid })}>Would you like to send this image?</Text>
        <Image {...styles.image({ isInvalid })} src={imageSrc} />
        <Stack {...styles.actions}>
          <Button {...styles.ok({ isInvalid })} isLoading={loading} onClick={onOkButtonClick}>
            OK
          </Button>
          <Button w='full' isDisabled={loading} onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const SendImageConfirmDialogContainer: React.VFC<ContainerProps<SendImageConfirmDialogProps, PresenterProps>> = ({
  presenter,
  isOpen,
  onClose: sicdClose,
  image,
  query: { contactInfo },
  mutation: { sendImage },
  ...props
}) => {
  // modal prop isCentered
  const isCentered = useBreakpointValue({ base: true, sm: false })

  // state
  const [imageSrc, setImageSrc] = useState<PresenterProps['imageSrc']>(undefined)
  useMemo(() => {
    if (isNullish(image)) return
    fileToDataURL(image)
      .then((dataUrl) => setImageSrc(dataUrl))
      .catch(() => setImageSrc(undefined))
  }, [image])

  // status
  const loading = sendImage.loading
  const errors = isNullish(image) || !isAllowedImageFile(image?.name) ? [getErrMsg('V_IMAGE_FORMAT')] : []
  sendImage.errors?.forEach((error) => errors.push(getErrMsg(error.message)))
  const isInvalid = !isBlank(errors)

  // onClick ok button
  const onOkButtonClick = () => {
    sendImage.reset()
    if (isNullish(image)) return
    const compressed = imageCompression(image)
    const mutate = (image: File) =>
      sendImage.mutate({ variables: { input: { contactId: toStr(contactInfo.result?.id), image } } })
    compressed.then(mutate).catch(toast('UnexpectedError'))
  }

  // modal onClose
  const onClose = useCallback(() => {
    sicdClose()
    setImageSrc(undefined)
  }, [sicdClose])

  useMemo(() => {
    if (!isOpen) setImageSrc(undefined)
  }, [isOpen])

  return presenter({
    isCentered,
    isOpen,
    onClose,
    imageSrc,
    isInvalid,
    loading,
    errors,
    onOkButtonClick,
    ...props
  })
}

/** SendImageConfirmDialog */
export default connect<SendImageConfirmDialogProps, PresenterProps>(
  'SendImageConfirmDialog',
  SendImageConfirmDialogPresenter,
  SendImageConfirmDialogContainer
)
