import { Flex, FlexProps, useDisclosure } from '@chakra-ui/react'
import Chat from 'components/04_organisms/Chat'
import ContactInfo from 'components/04_organisms/ContactInfo'
import ApplyContactConfirmDialog from 'components/04_organisms/dialogs/ApplyContactConfirmDialog'
import ApproveContactConfirmDialog from 'components/04_organisms/dialogs/ApproveContactConfirmDialog'
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
  MeQuery,
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
     * サインインユーザー情報
     */
    me: {
      result?: MeQuery['me']
    }
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
      result?: SendImageMutation['sendImage']
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
  applyccdDisc: Disclosure
  approveccdDisc: Disclosure
  mccdOpenDisc: Disclosure
  dccdDisc: Disclosure
  udccdDisc: Disclosure
  bccdDisc: Disclosure
  ubccdDisc: Disclosure
}

/** Presenter Component */
const MainPresenter: React.VFC<PresenterProps> = ({
  query: { me, contactInfo },
  mutation: {
    sendMessage,
    sendImage,
    deleteMessage,
    applyContact,
    approveContact,
    deleteContact,
    undeleteContact,
    blockContact,
    unblockContact
  },
  applyccdDisc,
  approveccdDisc,
  mccdOpenDisc,
  dccdDisc,
  udccdDisc,
  bccdDisc,
  ubccdDisc,
  ...props
}) => (
  <Flex {...styles.root} {...props}>
    <ContactInfo
      query={{ contactInfo }}
      onMccdOpen={mccdOpenDisc.onOpen}
      onDccdOpen={dccdDisc.onOpen}
      onUdccdOpen={udccdDisc.onOpen}
      onBccdOpen={bccdDisc.onOpen}
      onUbccdOpen={ubccdDisc.onOpen}
    />
    <Chat
      onApplyccdOpen={applyccdDisc.onOpen}
      onApproveccdOpen={approveccdDisc.onOpen}
      onUbccdOpen={ubccdDisc.onOpen}
      query={{ contactInfo }}
      mutation={{ deleteMessage }}
    />
    <SendMessageForm onMccdOpen={mccdOpenDisc.onOpen} query={{ contactInfo }} mutation={{ sendMessage, sendImage }} />
    <ApplyContactConfirmDialog
      query={{ contactInfo }}
      mutation={{ applyContact }}
      isOpen={applyccdDisc.isOpen}
      onClose={applyccdDisc.onClose}
    />
    <ApproveContactConfirmDialog
      query={{ me, contactInfo }}
      mutation={{ approveContact }}
      isOpen={approveccdDisc.isOpen}
      onClose={approveccdDisc.onClose}
    />
    <DeleteContactConfirmDialog
      query={{ contactInfo }}
      mutation={{ deleteContact }}
      isOpen={dccdDisc.isOpen}
      onClose={dccdDisc.onClose}
    />
    <UndeleteContactConfirmDialog
      query={{ contactInfo }}
      mutation={{ undeleteContact }}
      isOpen={udccdDisc.isOpen}
      onClose={udccdDisc.onClose}
    />
    <BlockContactConfirmDialog
      query={{ contactInfo }}
      mutation={{ blockContact }}
      isOpen={bccdDisc.isOpen}
      onClose={bccdDisc.onClose}
    />
    <UnblockContactConfirmDialog
      query={{ contactInfo }}
      mutation={{ unblockContact }}
      isOpen={ubccdDisc.isOpen}
      onClose={ubccdDisc.onClose}
    />
  </Flex>
)

/** Container Component */
const MainContainer: React.VFC<ContainerProps<MainProps, PresenterProps>> = ({
  presenter,
  query: { contactInfo, ...queryRest },
  mutation: {
    applyContact,
    approveContact,
    deleteContact,
    undeleteContact,
    blockContact,
    unblockContact,
    ...mutationRest
  },
  ...props
}) => {
  // MakeCallConfirmDialog modal
  const mccdOpenDisc = useDisclosure()

  // ApplyContactConfirmDialog modal
  const applyccdDisc = useDisclosure()
  const onApplyccdClose = applyccdDisc.onClose
  const applyContactResult = applyContact.result
  useMemo(() => {
    if (hasValue(applyContactResult)) onApplyccdClose()
  }, [onApplyccdClose, applyContactResult])

  // ApproveContactConfirmDialog modal
  const approveccdDisc = useDisclosure()
  const onApproveccdClose = approveccdDisc.onClose
  const approveContactResult = approveContact.result
  useMemo(() => {
    if (hasValue(approveContactResult)) onApproveccdClose()
  }, [onApproveccdClose, approveContactResult])

  // DeleteContactConfirmDialog modal
  const dccdDisc = useDisclosure()
  const onDccdClose = dccdDisc.onClose
  const deleteContactResult = deleteContact.result
  useMemo(() => {
    if (hasValue(deleteContactResult)) onDccdClose()
  }, [onDccdClose, deleteContactResult])

  // UndeleteContactConfirmDialog modal
  const udccdDisc = useDisclosure()
  const onUdccdClose = udccdDisc.onClose
  const undeleteContactResult = undeleteContact.result
  useMemo(() => {
    if (hasValue(undeleteContactResult)) onUdccdClose()
  }, [onUdccdClose, undeleteContactResult])

  // BlockContactConfirmDialog modal
  const bccdDisc = useDisclosure()
  const onBccdClose = bccdDisc.onClose
  const blockContactResult = blockContact.result
  useMemo(() => {
    if (hasValue(blockContactResult)) onBccdClose()
  }, [onBccdClose, blockContactResult])

  // UnblockContactConfirmDialog modal
  const ubccdDisc = useDisclosure()
  const onUbccdClose = ubccdDisc.onClose
  const unblockContactResult = unblockContact.result
  useMemo(() => {
    if (hasValue(unblockContactResult)) onUbccdClose()
  }, [onUbccdClose, unblockContactResult])

  return presenter({
    query: { contactInfo, ...queryRest },
    mutation: {
      applyContact,
      approveContact,
      deleteContact,
      undeleteContact,
      blockContact,
      unblockContact,
      ...mutationRest
    },
    applyccdDisc,
    approveccdDisc,
    mccdOpenDisc,
    dccdDisc,
    udccdDisc,
    bccdDisc,
    ubccdDisc,
    ...props
  })
}

/** Main */
export default connect<MainProps, PresenterProps>('Main', MainPresenter, MainContainer)
