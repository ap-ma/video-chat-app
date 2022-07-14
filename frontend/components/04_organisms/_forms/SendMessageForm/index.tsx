import { NetworkStatus } from '@apollo/client'
import {
  Box,
  BoxProps,
  Flex,
  FormControl,
  IconButton,
  Stack,
  Textarea,
  TextareaProps,
  useBreakpointValue
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import ErrorMessage from 'components/01_atoms/ErrorMessage'
import toast from 'components/01_atoms/Toast'
import { connect } from 'components/hoc'
import { useSetError } from 'components/hooks'
import { CONTACT } from 'const'
import {
  ContactInfoQuery,
  MeQuery,
  SendImageMutation,
  SendImageMutationVariables,
  SendMessageMutation,
  SendMessageMutationVariables
} from 'graphql/generated'
import React, { useMemo } from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { AiOutlinePhone } from 'react-icons/ai'
import { IoMdSend } from 'react-icons/io'
import {
  ContainerProps,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  OnOpen,
  QueryNetworkStatus,
  ValidationErrors
} from 'types'
import { toStr } from 'utils/general/helper'
import { hasValue, includes, isNullish } from 'utils/general/object'
import { getErrMsg } from 'utils/helper'
import SendImageIcon from './SendImageIcon'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** SendMessageForm Props */
export type SendMessageFormProps = BoxProps & {
  /**
   * 通話架電ダイアログ onOpen
   */
  onRucdOpen: OnOpen
  /**
   * Query
   */
  query: {
    /**
     * ユーザー情報
     */
    me: {
      result?: MeQuery['me']
    }
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
     * メッセージ送信
     */
    sendMessage: {
      result?: SendImageMutation['sendImage']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<SendMessageMutation, SendMessageMutationVariables>
    }
    /**
     * 画像送信
     */
    sendImage: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<SendImageMutation, SendImageMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<SendMessageFormProps, 'query' | 'mutation'> & {
  query: Omit<SendMessageFormProps['query'], 'me'>
  mutation: Omit<SendMessageFormProps['mutation'], 'sendMessage'>
} & {
  rows: TextareaProps['rows']
  loading: MutaionLoading
  notCallable: boolean
  disabled: boolean
  errors: string[]
  fieldErrors: FieldErrors<FormSchema>
  register: UseFormRegister<FormSchema>
  onSendButtonClick: ReturnType<UseFormHandleSubmit<FormSchema>>
}

/** Presenter Component */
const SendMessageFormPresenter: React.VFC<PresenterProps> = ({
  query: { contactInfo },
  mutation: { sendImage },
  rows,
  onRucdOpen,
  loading,
  notCallable,
  disabled,
  errors,
  fieldErrors,
  register,
  onSendButtonClick,
  ...props
}) => (
  <Box {...styles.root} {...props}>
    <Flex {...styles.container}>
      <FormControl id='sm_message' isDisabled={disabled} isInvalid={hasValue(fieldErrors.message)}>
        <Textarea placeholder='Enter your message here' {...styles.textarea} rows={rows} {...register('message')} />
        <ErrorMessage fontSize='sm' error={errors} />
      </FormControl>
      <Stack spacing='0' ml='1'>
        <SendImageIcon query={{ contactInfo }} mutation={{ sendImage }} disabled={disabled} />
        <IconButton
          icon={<AiOutlinePhone />}
          {...styles.phoneIcon}
          aria-label='ring up'
          disabled={notCallable}
          onClick={onRucdOpen}
        />
        <IconButton
          icon={<IoMdSend />}
          {...styles.sendIcon}
          aria-label='send message'
          isLoading={loading}
          disabled={disabled}
          onClick={onSendButtonClick}
        />
      </Stack>
    </Flex>
  </Box>
)

/** Container Component */
const SendMessageFormContainer: React.VFC<ContainerProps<SendMessageFormProps, PresenterProps>> = ({
  presenter,
  query: { me, contactInfo },
  mutation: { sendMessage, sendImage },
  ...props
}) => {
  // Textarea prop rows
  const rows = useBreakpointValue({ base: 2, md: 4 })

  // react hook form
  const { register, handleSubmit, setError, reset, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { message: '' }
  })

  // status
  const loading = sendMessage.loading
  const contactInfoLoading = includes(contactInfo.networkStatus, NetworkStatus.loading, NetworkStatus.refetch)
  const disabled =
    CONTACT.STATUS.UNAPPROVED === contactInfo.result?.status ||
    contactInfo.result?.blocked ||
    loading ||
    contactInfoLoading ||
    sendImage.loading
  const notCallable = me.result?.id === contactInfo.result?.userId || disabled
  const fieldErrors = formState.errors
  const fields = Object.keys(schema.shape)
  const sendMessageErrors = useSetError<FormSchema>(fields, setError, sendMessage.errors)
  const sendImageErrors = sendImage.errors?.map((error) => getErrMsg(error.message)) ?? []
  const errors = sendMessageErrors.concat(sendImageErrors)

  // mutate
  const sendMessageMutation: SubmitHandler<FormSchema> = ({ message }) => {
    const input = { contactId: toStr(contactInfo.result?.id), message }
    sendMessage.reset()
    sendMessage
      .mutate({ variables: { input } })
      .then(() => reset())
      .catch(toast('UnexpectedError'))
  }

  // onClick send button
  const onSendButtonClick = handleSubmit(sendMessageMutation)

  // ContactInfo change
  useMemo(() => {
    if (!isNullish(contactInfo.result?.id)) reset()
  }, [contactInfo.result?.id, reset])

  return presenter({
    query: { contactInfo },
    mutation: { sendImage },
    rows,
    loading,
    notCallable,
    disabled,
    errors,
    fieldErrors,
    register,
    onSendButtonClick,
    ...props
  })
}

/** SendMessageForm */
export default connect<SendMessageFormProps, PresenterProps>(
  'SendMessageForm',
  SendMessageFormPresenter,
  SendMessageFormContainer
)
