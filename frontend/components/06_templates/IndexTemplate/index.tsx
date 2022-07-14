import { Box, Drawer, DrawerContent, useBoolean, useDisclosure } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import Calling from 'components/04_organisms/Calling'
import Header from 'components/04_organisms/Header'
import Main from 'components/04_organisms/Main'
import ReceiveCall from 'components/04_organisms/ReceiveCall'
import Sidebar from 'components/04_organisms/Sidebar'
import HtmlSkeleton, { Title } from 'components/05_layouts/HtmlSkeleton'
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
  ChangeEmailMutation,
  ChangeEmailMutationVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  ContactInfoQuery,
  ContactInfoQueryVariables,
  ContactsQuery,
  ContactsQueryVariables,
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  DeleteContactMutation,
  DeleteContactMutationVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  EditProfileMutation,
  EditProfileMutationVariables,
  HangUpMutation,
  HangUpMutationVariables,
  IceCandidateSubscription,
  LatestMessagesQuery,
  LatestMessagesQueryVariables,
  MeQuery,
  MeQueryVariables,
  PickUpMutation,
  PickUpMutationVariables,
  RingUpMutation,
  RingUpMutationVariables,
  SearchUserQuery,
  SearchUserQueryVariables,
  SendIceCandidateMutation,
  SendIceCandidateMutationVariables,
  SendImageMutation,
  SendImageMutationVariables,
  SendMessageMutation,
  SendMessageMutationVariables,
  SignalingSubscription,
  SignalType,
  SignOutMutation,
  SignOutMutationVariables,
  UnblockContactMutation,
  UnblockContactMutationVariables,
  UndeleteContactMutation,
  UndeleteContactMutationVariables
} from 'graphql/generated'
import React, { useMemo, useState } from 'react'
import {
  ApolloClient,
  CallType,
  ContactInfoUserId,
  ContainerProps,
  Disclosure,
  LazyQueryFunction,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  QueryRefetch,
  SetState,
  SubscriptionLoading,
  ValidationErrors
} from 'types'
import { includes, isNullish } from 'utils/general/object'
import * as styles from './styles'

/** IndexTemplate Props */
export type IndexTemplateProps = {
  /**
   * ApolloClient
   */
  apolloClient: ApolloClient
  /**
   * Local State
   */
  state: {
    /**
     *  コンタクト情報 ユーザーID
     */
    contactInfoUserId: {
      state: ContactInfoUserId
      setContactInfoUserId: SetState<ContactInfoUserId>
    }
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
      loading: QueryLoading
      refetch: QueryRefetch<MeQuery, MeQueryVariables>
    }
    /**
     * コンタクト一覧
     */
    contacts: {
      result?: ContactsQuery['contacts']
      loading: QueryLoading
      refetch: QueryRefetch<ContactsQuery, ContactsQueryVariables>
    }
    /**
     * メッセージ一覧
     */
    latestMessages: {
      result?: LatestMessagesQuery['latestMessages']
      loading: QueryLoading
      refetch: QueryRefetch<LatestMessagesQuery, LatestMessagesQueryVariables>
    }
    /**
     *  コンタクト情報
     */
    contactInfo: {
      result?: ContactInfoQuery['contactInfo']
      loading: QueryLoading
      networkStatus: QueryNetworkStatus
      refetch: QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
      fetchMore: QueryFetchMore<ContactInfoQuery, ContactInfoQueryVariables>
    }
    /**
     * ユーザー検索
     */
    searchUser: {
      result?: SearchUserQuery['searchUser']
      loading: QueryLoading
      query: LazyQueryFunction<SearchUserQuery, SearchUserQueryVariables>
    }
  }
  /**
   * Mutation
   */
  mutation: {
    /**
     * サインアウト
     */
    signOut: {
      loading: MutaionLoading
      mutate: MutateFunction<SignOutMutation, SignOutMutationVariables>
    }
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
    /**
     * メールアドレス変更
     */
    changeEmail: {
      result?: ChangeEmailMutation['changeEmail']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ChangeEmailMutation, ChangeEmailMutationVariables>
    }
    /**
     * パスワード変更
     */
    changePassword: {
      result?: ChangePasswordMutation['changePassword']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ChangePasswordMutation, ChangePasswordMutationVariables>
    }
    /**
     * アカウント削除
     */
    deleteAccount: {
      result?: DeleteAccountMutation['deleteAccount']
      loading: MutaionLoading
      mutate: MutateFunction<DeleteAccountMutation, DeleteAccountMutationVariables>
    }
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
export type PresenterProps = IndexTemplateProps & {
  rcCallId?: Call['id']
  sbDisc: Disclosure
  rcDisc: Disclosure
  dispCalling: boolean
}

/** Presenter Component */
const IndexTemplatePresenter: React.VFC<PresenterProps> = ({
  apolloClient,
  state: { contactInfoUserId, callType },
  query: { me, contacts, latestMessages, contactInfo, searchUser },
  mutation: {
    signOut,
    editProfile,
    changeEmail,
    changePassword,
    deleteAccount,
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
  sbDisc,
  rcDisc,
  dispCalling
}) => (
  <HtmlSkeleton>
    <Title>Home</Title>
    <Box minH='100vh'>
      <Sidebar
        {...styles.mdSidebar}
        state={{ contactInfoUserId }}
        query={{ me, contacts, latestMessages, contactInfo }}
        onClose={sbDisc.onClose}
      />
      <Drawer {...styles.drawer} isOpen={sbDisc.isOpen} onClose={sbDisc.onClose} onOverlayClick={sbDisc.onClose}>
        <DrawerContent>
          <Sidebar
            state={{ contactInfoUserId }}
            query={{ me, contacts, latestMessages, contactInfo }}
            onClose={sbDisc.onClose}
          />
        </DrawerContent>
      </Drawer>
      <Header
        onSbOpen={sbDisc.onOpen}
        state={{ contactInfoUserId }}
        query={{ me, contactInfo, searchUser }}
        mutation={{ signOut, editProfile, changeEmail, changePassword, deleteAccount }}
      />
      <Main
        state={{ callType }}
        query={{ me, contactInfo }}
        mutation={{
          sendMessage,
          sendImage,
          deleteMessage,
          applyContact,
          approveContact,
          deleteContact,
          undeleteContact,
          blockContact,
          unblockContact
        }}
      />
    </Box>
    <Calling
      rcCallId={rcCallId}
      apolloClient={apolloClient}
      state={{ callType }}
      query={{ contactInfo }}
      mutation={{ ringUp, pickUp, hangUp, cancel, sendIceCandidate }}
      subscription={{ signaling, iceCandidate }}
      {...styles.calling({ dispCalling })}
    />
    <ReceiveCall
      state={{ callType }}
      mutation={{ cancel }}
      subscription={{ signaling }}
      isOpen={rcDisc.isOpen}
      onClose={rcDisc.onClose}
    />
  </HtmlSkeleton>
)

/** Container Component */
const IndexTemplateContainer: React.VFC<ContainerProps<IndexTemplateProps, PresenterProps>> = ({
  presenter,
  state: { callType, ...stateRest },
  mutation: { cancel, ...mutationRest },
  subscription: { signaling, ...subscriptionRest },
  ...props
}) => {
  // state
  const [rcCallId, setRcCallId] = useState<Call['id'] | undefined>(undefined)

  // Sidebar
  const sbDisc = useDisclosure()

  // ReceiveCall
  const rcDisc = useDisclosure()
  const onRcClose = rcDisc.onClose
  const callTypeState = callType.state
  const signalingResult = signaling.result
  useMemo(() => {
    if (CallType.Answer === callTypeState) onRcClose()
    if (SignalType.Cancel === signalingResult?.signalType) {
      if (rcCallId === signalingResult?.callId) onRcClose()
    }
  }, [onRcClose, callTypeState, signalingResult, rcCallId])

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

  // Calling
  const [dispCalling, setDispCalling] = useBoolean(false)
  useMemo(() => {
    if (CallType.Close === callTypeState) setTimeout(setDispCalling.off, 200)
    if (includes(callTypeState, CallType.Offer, CallType.Answer)) setDispCalling.on()
  }, [callTypeState]) // eslint-disable-line react-hooks/exhaustive-deps

  return presenter({
    state: { callType, ...stateRest },
    mutation: { cancel, ...mutationRest },
    subscription: { signaling, ...subscriptionRest },
    rcCallId,
    sbDisc,
    rcDisc,
    dispCalling,
    ...props
  })
}

/** IndexTemplate */
export default connect<IndexTemplateProps, PresenterProps>(
  'IndexTemplate',
  IndexTemplatePresenter,
  IndexTemplateContainer
)
