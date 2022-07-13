import { Flex, FlexProps, useDisclosure } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import Calling from 'components/04_organisms/Calling'
import ContactInfoBody from 'components/04_organisms/ContactInfoBody'
import ContactInfoHead from 'components/04_organisms/ContactInfoHead'
import ReceiveCall from 'components/04_organisms/ReceiveCall'
import BlockContactConfirmDialog from 'components/04_organisms/_dialogs/BlockContactConfirmDialog'
import DeleteContactConfirmDialog from 'components/04_organisms/_dialogs/DeleteContactConfirmDialog'
import RingUpConfirmDialog from 'components/04_organisms/_dialogs/RingUpConfirmDialog'
import UnblockContactConfirmDialog from 'components/04_organisms/_dialogs/UnblockContactConfirmDialog'
import UndeleteContactConfirmDialog from 'components/04_organisms/_dialogs/UndeleteContactConfirmDialog'
import SendMessageForm from 'components/04_organisms/_forms/SendMessageForm'
import { connect } from 'components/hoc'
import {
  ApplyContactMutation,
  ApplyContactMutationVariables,
  ApproveContactMutation,
  ApproveContactMutationVariables,
  BlockContactMutation,
  BlockContactMutationVariables,
  Call,
  CancelMutation,
  CancelMutationVariables,
  ContactInfoQuery,
  ContactInfoQueryVariables,
  DeleteContactMutation,
  DeleteContactMutationVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  HangUpMutation,
  HangUpMutationVariables,
  IceCandidateSubscription,
  MeQuery,
  PickUpMutation,
  PickUpMutationVariables,
  RingUpMutation,
  RingUpMutationVariables,
  SendIceCandidateMutation,
  SendIceCandidateMutationVariables,
  SendImageMutation,
  SendImageMutationVariables,
  SendMessageMutation,
  SendMessageMutationVariables,
  SignalingSubscription,
  SignalType,
  UnblockContactMutation,
  UnblockContactMutationVariables,
  UndeleteContactMutation,
  UndeleteContactMutationVariables
} from 'graphql/generated'
import React, { Fragment, useMemo, useState } from 'react'
import {
  ApolloClient,
  CallType,
  ContainerProps,
  Disclosure,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  SetState,
  SubscriptionLoading,
  ValidationErrors
} from 'types'
import { hasValue, isNullish } from 'utils/general/object'
import * as styles from './styles'

/** Main Props */
export type MainProps = FlexProps & {
  /**
   * ApolloClient
   */
  apolloClient: ApolloClient
  /**
   * Local State
   */
  state: {
    /**
     *  通話タイプ
     */
    callType: {
      state: CallType
      setCallType: SetState<CallType>
    }
  }
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
     * 通話架電
     */
    ringUp: {
      result?: RingUpMutation['ringUp']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<RingUpMutation, RingUpMutationVariables>
    }
    /**
     * 通話応答
     */
    pickUp: {
      result?: PickUpMutation['pickUp']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<PickUpMutation, PickUpMutationVariables>
    }
    /**
     * 通話終了
     */
    hangUp: {
      result?: HangUpMutation['hangUp']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<HangUpMutation, HangUpMutationVariables>
    }
    /**
     * 通話キャンセル
     */
    cancel: {
      result?: CancelMutation['cancel']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<CancelMutation, CancelMutationVariables>
    }
    /**
     * ICE Candidate 送信
     */
    sendIceCandidate: {
      result?: SendIceCandidateMutation['sendIceCandidate']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<SendIceCandidateMutation, SendIceCandidateMutationVariables>
    }
    /**
     * メッセージ削除
     */
    deleteMessage: {
      result?: DeleteMessageMutation['deleteMessage']
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
  /**
   * Subscription
   */
  subscription: {
    /**
     * シグナリング
     */
    signaling: {
      result?: SignalingSubscription['signalingSubscription']
      loading: SubscriptionLoading
    }
    /**
     * ICE Candidate
     */
    iceCandidate: {
      result?: IceCandidateSubscription['iceCandidateSubscription']
      loading: SubscriptionLoading
    }
  }
}

/** Presenter Props */
export type PresenterProps = MainProps & {
  rcCallId?: Call['id']
  callingDisc: Disclosure
  rcDisc: Disclosure
  rucdDisc: Disclosure
  dccdDisc: Disclosure
  udccdDisc: Disclosure
  bccdDisc: Disclosure
  ubccdDisc: Disclosure
}

/** Presenter Component */
const MainPresenter: React.VFC<PresenterProps> = ({
  apolloClient,
  state: { callType },
  query: { me, contactInfo },
  mutation: {
    sendMessage,
    sendImage,
    ringUp,
    pickUp,
    hangUp,
    cancel,
    sendIceCandidate,
    deleteMessage,
    applyContact,
    approveContact,
    deleteContact,
    undeleteContact,
    blockContact,
    unblockContact
  },
  subscription: { signaling, iceCandidate },
  rcCallId,
  callingDisc,
  rcDisc,
  rucdDisc,
  dccdDisc,
  udccdDisc,
  bccdDisc,
  ubccdDisc,
  ...props
}) => (
  <Fragment>
    <Flex {...styles.root} {...props}>
      <ContactInfoHead
        query={{ me, contactInfo }}
        onRucdOpen={rucdDisc.onOpen}
        onDccdOpen={dccdDisc.onOpen}
        onUdccdOpen={udccdDisc.onOpen}
        onBccdOpen={bccdDisc.onOpen}
        onUbccdOpen={ubccdDisc.onOpen}
      />
      <ContactInfoBody
        query={{ me, contactInfo }}
        mutation={{ deleteMessage, applyContact, approveContact, unblockContact }}
      />
      <SendMessageForm onRucdOpen={rucdDisc.onOpen} query={{ contactInfo }} mutation={{ sendMessage, sendImage }} />
    </Flex>
    {/* modal */}
    <Calling
      rcCallId={rcCallId}
      apolloClient={apolloClient}
      state={{ callType }}
      query={{ contactInfo }}
      mutation={{ ringUp, pickUp, hangUp, cancel, sendIceCandidate }}
      subscription={{ signaling, iceCandidate }}
      isOpen={callingDisc.isOpen}
      onClose={callingDisc.onClose}
    />
    <RingUpConfirmDialog
      onCallingOpen={callingDisc.onOpen}
      state={{ callType }}
      isOpen={rucdDisc.isOpen}
      onClose={rucdDisc.onClose}
    />
    <ReceiveCall
      onCallingOpen={callingDisc.onOpen}
      state={{ callType }}
      mutation={{ cancel }}
      subscription={{ signaling }}
      isOpen={rcDisc.isOpen}
      onClose={rcDisc.onClose}
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
  </Fragment>
)

/** Container Component */
const MainContainer: React.VFC<ContainerProps<MainProps, PresenterProps>> = ({
  presenter,
  state: { callType },
  query: { contactInfo, ...queryRest },
  mutation: {
    applyContact,
    approveContact,
    deleteContact,
    undeleteContact,
    blockContact,
    unblockContact,
    cancel,
    ...mutationRest
  },
  subscription: { signaling, ...subscriptionRest },
  ...props
}) => {
  // state
  const [rcCallId, setRcCallId] = useState<Call['id'] | undefined>(undefined)

  // Calling
  const callingDisc = useDisclosure()

  // ReceiveCall
  const rcDisc = useDisclosure()
  const onRcClose = rcDisc.onClose
  const canceltResult = cancel.result
  const callTypeState = callType.state
  const signalingResult = signaling.result
  useMemo(() => {
    if (hasValue(canceltResult)) onRcClose()
    if (CallType.Answer === callTypeState) onRcClose()
    if (SignalType.Cancel === signalingResult?.signalType) {
      if (rcCallId === signalingResult?.callId) onRcClose()
    }
  }, [onRcClose, canceltResult, callTypeState, signalingResult, rcCallId])

  // Receive a Call
  useMemo(() => {
    if (isNullish(signalingResult)) return
    if (SignalType.Offer !== signalingResult.signalType) return
    // 通話中、通話架電中、通話受信中 以外
    if (CallType.Close === callTypeState && !rcDisc.isOpen) {
      setRcCallId(signalingResult.callId)
      return rcDisc.onOpen()
    }
    const callId = signalingResult.callId
    cancel.reset()
    cancel.mutate({ variables: { callId } }).catch(toast('UnexpectedError'))
  }, [signalingResult]) // eslint-disable-line react-hooks/exhaustive-deps

  // RingUpConfirmDialog modal
  const rucdDisc = useDisclosure()
  const onRucdClose = rucdDisc.onClose
  const callTypeDisciscOpen = callingDisc.isOpen
  useMemo(() => {
    if (callTypeDisciscOpen) onRucdClose()
  }, [onRucdClose, callTypeDisciscOpen])

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
    state: { callType },
    query: { contactInfo, ...queryRest },
    mutation: {
      applyContact,
      approveContact,
      deleteContact,
      undeleteContact,
      blockContact,
      unblockContact,
      cancel,
      ...mutationRest
    },
    subscription: { signaling, ...subscriptionRest },
    rcCallId,
    callingDisc,
    rcDisc,
    rucdDisc,
    dccdDisc,
    udccdDisc,
    bccdDisc,
    ubccdDisc,
    ...props
  })
}

/** Main */
export default connect<MainProps, PresenterProps>('Main', MainPresenter, MainContainer)
