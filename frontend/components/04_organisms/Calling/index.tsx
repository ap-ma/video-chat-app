import { AspectRatio, Box, BoxProps, HStack, IconButton, IconButtonProps, Stack, useBoolean } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import {
  Call,
  CancelMutation,
  CancelMutationVariables,
  ContactInfoQuery,
  HangUpMutation,
  HangUpMutationVariables,
  IceCandidateSubscription,
  PickUpMutation,
  PickUpMutationVariables,
  RingUpMutation,
  RingUpMutationVariables,
  SendIceCandidatesMutation,
  SendIceCandidatesMutationVariables,
  SignalFieldsFragmentDoc,
  SignalingSubscription
} from 'graphql/generated'
import React, { Ref, useMemo, useRef } from 'react'
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
  BsSquareFill
} from 'react-icons/bs'
import { ApolloClient, CallType, ContainerProps, MutateFunction, SetState, SubscriptionLoading } from 'types'
import { isNullish } from 'utils/general/object'
import { WebRTC } from 'utils/webrtc'
import * as styles from './styles'

/** Calling Props */
export type CallingProps = BoxProps & {
  /**
   * 応答 Call ID
   */
  rcCallId?: Call['id']
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
     *  コンタクト情報
     */
    contactInfo: {
      result?: ContactInfoQuery['contactInfo']
    }
  }
  /**
   * Mutation
   */
  mutation: {
    /**
     * 通話架電
     */
    ringUp: {
      mutate: MutateFunction<RingUpMutation, RingUpMutationVariables>
    }
    /**
     * 通話応答
     */
    pickUp: {
      mutate: MutateFunction<PickUpMutation, PickUpMutationVariables>
    }
    /**
     * 通話終了
     */
    hangUp: {
      mutate: MutateFunction<HangUpMutation, HangUpMutationVariables>
    }
    /**
     * 通話キャンセル
     */
    cancel: {
      mutate: MutateFunction<CancelMutation, CancelMutationVariables>
    }
    /**
     * ICE Candidate 送信
     */
    sendIceCandidates: {
      mutate: MutateFunction<SendIceCandidatesMutation, SendIceCandidatesMutationVariables>
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
export type PresenterProps = Omit<
  CallingProps,
  'rcCallId' | 'apolloClient' | 'state' | 'query' | 'mutation' | 'subscription'
> & {
  micState: boolean
  cameraState: boolean
  remoteVideoRef: Ref<HTMLVideoElement>
  localVideoRef: Ref<HTMLVideoElement>
  onMicButtonClick: IconButtonProps['onClick']
  onCameraButtonClick: IconButtonProps['onClick']
  onHangUpButtonClick: IconButtonProps['onClick']
}

/** Presenter Component */
const CallingPresenter: React.VFC<PresenterProps> = ({
  micState,
  cameraState,
  remoteVideoRef,
  localVideoRef,
  onMicButtonClick,
  onCameraButtonClick,
  onHangUpButtonClick,
  ...props
}) => (
  <Box {...styles.root} {...props}>
    <Stack {...styles.container}>
      <Stack {...styles.screen}>
        <AspectRatio {...styles.video}>
          <video poster='/black.png' ref={remoteVideoRef}></video>
        </AspectRatio>
        <AspectRatio {...styles.video}>
          <video poster='/black.png' ref={localVideoRef} muted></video>
        </AspectRatio>
      </Stack>
      <HStack {...styles.actions}>
        <IconButton
          {...styles.mediaButton}
          aria-label='mic'
          icon={micState ? <BsFillMicFill /> : <BsFillMicMuteFill />}
          onClick={onMicButtonClick}
        />
        <IconButton
          {...styles.mediaButton}
          aria-label='camera'
          icon={cameraState ? <BsFillCameraVideoFill /> : <BsFillCameraVideoOffFill />}
          onClick={onCameraButtonClick}
        />
        <IconButton
          {...styles.hangUpButton}
          aria-label='hang up'
          icon={<BsSquareFill />}
          onClick={onHangUpButtonClick}
        />
      </HStack>
    </Stack>
  </Box>
)

/** Container Component */
const CallingContainer: React.VFC<ContainerProps<CallingProps, PresenterProps>> = ({
  presenter,
  rcCallId,
  apolloClient,
  state: { callType },
  query: { contactInfo },
  mutation: { ringUp, pickUp, hangUp, cancel, sendIceCandidates },
  subscription: { signaling, iceCandidate },
  ...props
}) => {
  const session = useRef<WebRTC | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [micState, setMicState] = useBoolean(true)
  const [cameraState, setCameraState] = useBoolean(true)

  // MicButton onClick
  const onMicButtonClick = () => {
    const connection = session.current
    if (isNullish(connection)) return
    connection.setMicState = !micState
    setMicState.toggle()
  }

  // CameraButton onClick
  const onCameraButtonClick = () => {
    const connection = session.current
    if (isNullish(connection)) return
    connection.setCameraState = !cameraState
    setCameraState.toggle()
  }

  // HangUpButton onClick
  const onHangUpButtonClick = () => {
    const connection = session.current
    if (isNullish(connection)) return
    connection.hangUp()
    setTimeout(() => {
      setMicState.on()
      setCameraState.on()
    }, 200)
  }

  // 通話モード変更時
  useMemo(() => {
    if (CallType.Close === callType.state) {
      // 通話切断時
      session.current = null
      return
    }

    // RTCPeerConnection
    const connection = new WebRTC(
      callType.state,
      callType.setCallType,
      ringUp.mutate,
      pickUp.mutate,
      hangUp.mutate,
      cancel.mutate,
      sendIceCandidates.mutate,
      remoteVideoRef.current,
      localVideoRef.current
    )

    session.current = connection

    // 通話架電時
    if (CallType.Offer === callType.state) {
      if (!isNullish(contactInfo.result)) {
        connection.offer(contactInfo.result.id, contactInfo.result.userId)
      }
    }

    // 通話応答時
    if (CallType.Answer === callType.state) {
      const answerdCallSignal = apolloClient.readFragment<SignalingSubscription['signalingSubscription']>({
        id: rcCallId,
        fragment: SignalFieldsFragmentDoc
      })
      if (!isNullish(answerdCallSignal)) connection.answer(answerdCallSignal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callType.state])

  // シグナリング
  useMemo(() => {
    const connection = session.current
    if (isNullish(connection) || isNullish(signaling.result)) return
    connection.signaling(signaling.result)
  }, [signaling.result])

  // ICE Candidate
  useMemo(() => {
    const connection = session.current
    if (isNullish(connection) || isNullish(iceCandidate.result)) return
    connection.addIceCandidates(iceCandidate.result)
  }, [iceCandidate.result])

  return presenter({
    micState,
    cameraState,
    remoteVideoRef,
    localVideoRef,
    onMicButtonClick,
    onCameraButtonClick,
    onHangUpButtonClick,
    ...props
  })
}

/** Calling */
export default connect<CallingProps, PresenterProps>('Calling', CallingPresenter, CallingContainer)
