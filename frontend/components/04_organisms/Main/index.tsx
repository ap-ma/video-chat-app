import { Flex, FlexProps, useDisclosure } from '@chakra-ui/react'
import Chat from 'components/04_organisms/Chat'
import ContactInfo from 'components/04_organisms/ContactInfo'
import BlockContactConfirmDialog from 'components/04_organisms/dialogs/BlockContactConfirmDialog'
import DeleteContactConfirmDialog from 'components/04_organisms/dialogs/DeleteContactConfirmDialog'
import UnblockContactConfirmDialog from 'components/04_organisms/dialogs/UnblockContactConfirmDialog'
import UndeleteContactConfirmDialog from 'components/04_organisms/dialogs/UndeleteContactConfirmDialog'
import SendMessageForm from 'components/04_organisms/forms/SendMessageForm'
import { connect } from 'components/hoc'
import {
  ApplyContactMutation,
  ApplyContactMutationVariables,
  ApproveContactMutation,
  ApproveContactMutationVariables,
  BlockContactMutation,
  BlockContactMutationVariables,
  ContactInfoQuery,
  ContactInfoQueryVariables,
  DeleteContactMutation,
  DeleteContactMutationVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  ReadMessagesMutation,
  ReadMessagesMutationVariables,
  SendImageMutation,
  SendImageMutationVariables,
  SendMessageMutation,
  SendMessageMutationVariables,
  UnblockContactMutation,
  UnblockContactMutationVariables,
  UndeleteContactMutation,
  UndeleteContactMutationVariables
} from 'graphql/generated'
import React, { useMemo } from 'react'
import {
  ContainerProps,
  Disclosure,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  ValidationErrors
} from 'types'
import { hasValue } from 'utils/general/object'
import * as styles from './styles'

/** Main Props */
export type MainProps = FlexProps & {
  /**
   * Query
   */
  query: {
    /**
     *  コンタクト情報
     */
    contactInfo: {
      result?: ContactInfoQuery['contactInfo']
      loading: QueryLoading
      networkStatus: QueryNetworkStatus
      fetchMore: QueryFetchMore<ContactInfoQuery, ContactInfoQueryVariables>
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
    /**
     * メッセージ削除
     */
    deleteMessage: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
    /**
     * メッセージ既読
     */
    readMessages: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ReadMessagesMutation, ReadMessagesMutationVariables>
    }
    /**
     * コンタクト申請
     */
    applyContact: {
      result?: ApplyContactMutation['applyContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ApplyContactMutation, ApplyContactMutationVariables>
    }
    /**
     * コンタクト承認
     */
    approveContact: {
      result?: ApproveContactMutation['approveContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ApproveContactMutation, ApproveContactMutationVariables>
    }
    /**
     * コンタクト削除
     */
    deleteContact: {
      result?: DeleteContactMutation['deleteContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<DeleteContactMutation, DeleteContactMutationVariables>
    }
    /**
     * コンタクト削除取消
     */
    undeleteContact: {
      result?: UndeleteContactMutation['undeleteContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<UndeleteContactMutation, UndeleteContactMutationVariables>
    }
    /**
     * コンタクトブロック
     */
    blockContact: {
      result?: BlockContactMutation['blockContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<BlockContactMutation, BlockContactMutationVariables>
    }
    /**
     * コンタクトブロック解除
     */
    unblockContact: {
      result?: UnblockContactMutation['unblockContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<UnblockContactMutation, UnblockContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = MainProps & {
  mccdOpenDisc: Disclosure
  dccdOpenDisc: Disclosure
  udccdOpenDisc: Disclosure
  bccdOpenDisc: Disclosure
  ubccdOpenDisc: Disclosure
}

/** Presenter Component */
const MainPresenter: React.VFC<PresenterProps> = ({
  query: { contactInfo },
  mutation: {
    sendMessage,
    sendImage,
    deleteMessage,
    readMessages,
    applyContact,
    approveContact,
    deleteContact,
    undeleteContact,
    blockContact,
    unblockContact
  },
  mccdOpenDisc,
  dccdOpenDisc,
  udccdOpenDisc,
  bccdOpenDisc,
  ubccdOpenDisc,
  ...props
}) => (
  <Flex {...styles.root} {...props}>
    <ContactInfo
      query={{ contactInfo }}
      onMccdOpen={mccdOpenDisc.onOpen}
      onDccdOpen={dccdOpenDisc.onOpen}
      onUdccdOpen={udccdOpenDisc.onOpen}
      onBccdOpen={bccdOpenDisc.onOpen}
      onUbccdOpen={ubccdOpenDisc.onOpen}
    />
    <Chat />
    <SendMessageForm />
    <DeleteContactConfirmDialog
      query={{ contactInfo }}
      mutation={{ deleteContact }}
      isOpen={dccdOpenDisc.isOpen}
      onClose={dccdOpenDisc.onClose}
    />
    <UndeleteContactConfirmDialog
      query={{ contactInfo }}
      mutation={{ undeleteContact }}
      isOpen={udccdOpenDisc.isOpen}
      onClose={udccdOpenDisc.onClose}
    />
    <BlockContactConfirmDialog
      query={{ contactInfo }}
      mutation={{ blockContact }}
      isOpen={bccdOpenDisc.isOpen}
      onClose={bccdOpenDisc.onClose}
    />
    <UnblockContactConfirmDialog
      query={{ contactInfo }}
      mutation={{ unblockContact }}
      isOpen={ubccdOpenDisc.isOpen}
      onClose={ubccdOpenDisc.onClose}
    />
  </Flex>
)

/** Container Component */
const MainContainer: React.VFC<ContainerProps<MainProps, PresenterProps>> = ({ presenter, mutation, ...props }) => {
  // MakeCallConfirmDialog modal
  const mccdOpenDisc = useDisclosure()

  // DeleteContactConfirmDialog modal
  const dccdOpenDisc = useDisclosure()
  const onDccdClose = dccdOpenDisc.onClose
  const deleteContactResult = mutation.deleteContact.result
  useMemo(() => {
    if (hasValue(deleteContactResult)) onDccdClose()
  }, [onDccdClose, deleteContactResult])

  // UndeleteContactConfirmDialog modal
  const udccdOpenDisc = useDisclosure()
  const onUdccdClose = udccdOpenDisc.onClose
  const undeleteContactResult = mutation.undeleteContact.result
  useMemo(() => {
    if (hasValue(undeleteContactResult)) onUdccdClose()
  }, [onUdccdClose, undeleteContactResult])

  // BlockContactConfirmDialog modal
  const bccdOpenDisc = useDisclosure()
  const onBccdClose = bccdOpenDisc.onClose
  const blockContactResult = mutation.blockContact.result
  useMemo(() => {
    if (hasValue(blockContactResult)) onBccdClose()
  }, [onBccdClose, blockContactResult])

  // UnblockContactConfirmDialog modal
  const ubccdOpenDisc = useDisclosure()
  const onUbccdClose = ubccdOpenDisc.onClose
  const unblockContactResult = mutation.unblockContact.result
  useMemo(() => {
    if (hasValue(unblockContactResult)) onUbccdClose()
  }, [onUbccdClose, unblockContactResult])

  return presenter({
    mutation,
    mccdOpenDisc,
    dccdOpenDisc,
    udccdOpenDisc,
    bccdOpenDisc,
    ubccdOpenDisc,
    ...props
  })
}

/** Main */
export default connect<MainProps, PresenterProps>('Main', MainPresenter, MainContainer)
