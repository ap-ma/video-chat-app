import {
  IconButton,
  IconButtonProps,
  Input,
  InputProps,
  useBreakpointValue,
  useDisclosure,
  useMergeRefs
} from '@chakra-ui/react'
import SendImageConfirmDialog, {
  SendImageConfirmDialogProps
} from 'components/04_organisms/_dialogs/SendImageConfirmDialog'
import { connectRef } from 'components/hoc'
import { ALLOWED_IMAGE_EXTS } from 'const'
import { ContactInfoQuery, SendImageMutation, SendImageMutationVariables } from 'graphql/generated'
import React, { forwardRef, Fragment, Ref, useCallback, useMemo, useRef } from 'react'
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

/** SendImageForm Props */
export type SendImageFormProps = Optional<IconButtonProps, 'aria-label'> & {
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
export type PresenterProps = SendImageFormProps & {
  ref: Ref<HTMLInputElement>
  sicdDisc: Disclosure
  isCentered: SendImageConfirmDialogProps['isCentered']
  image: SendImageConfirmDialogProps['image']
  onImageIconClick: IconButtonProps['onClick']
  onImageChange: InputProps['onChange']
}

/** Presenter Component */
const SendImageFormPresenter = forwardRef<HTMLInputElement, Omit<PresenterProps, 'ref'>>(
  ({ query, mutation, sicdDisc, isCentered, image, onImageIconClick, onImageChange, ...props }, ref) => (
    <Fragment>
      <IconButton
        icon={<AiOutlineFileImage />}
        {...styles.imageIcon}
        aria-label='send image'
        onClick={onImageIconClick}
        {...props}
      />
      <Input {...styles.fileInput(ALLOWED_IMAGE_EXTS)} onChange={onImageChange} ref={ref} />
      <SendImageConfirmDialog
        {...{ isCentered, query, mutation, image }}
        isOpen={sicdDisc.isOpen}
        onClose={sicdDisc.onClose}
      />
    </Fragment>
  )
)

/** Container Component */
const SendImageFormContainer = forwardRef<HTMLInputElement, ContainerProps<SendImageFormProps, PresenterProps>>(
  ({ presenter, mutation: { sendImage }, ...props }, ref) => {
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
      ref: useMergeRefs<HTMLInputElement>(ref, fileInputRef),
      sicdDisc,
      isCentered,
      image,
      onImageIconClick,
      onImageChange,
      ...props
    })
  }
)

// display name
SendImageFormPresenter.displayName = 'SendImageFormPresenter'
SendImageFormContainer.displayName = 'SendImageFormContainer'

/** SendImageForm */
export default connectRef<HTMLInputElement, SendImageFormProps, PresenterProps>(
  'SendImageForm',
  SendImageFormPresenter,
  SendImageFormContainer
)
