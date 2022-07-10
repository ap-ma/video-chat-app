import {
  Avatar,
  HStack,
  IconButton,
  IconButtonProps,
  ModalBody,
  ModalContent,
  Stack,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import toast from 'components/01_atoms/Toast'
import { connect } from 'components/hoc'
import { CancelMutation, CancelMutationVariables, SignalingSubscription } from 'graphql/generated'
import React from 'react'
import { ImPhone, ImPhoneHangUp } from 'react-icons/im'
import { CallType, ContainerProps, MutaionLoading, MutaionReset, MutateFunction, OnOpen, SetState } from 'types'
import { toStr } from 'utils/general/helper'
import { isNullish } from 'utils/general/object'
import * as styles from './styles'

/** ReceiveCall Props */
export type ReceiveCallProps = Omit<ModalProps, 'children'> & {
  /**
   * 通話画面 onOpen
   */
  onCallingOpen: OnOpen
  /**
   * Local State
   */
  state: {
    /**
     *  通話タイプ
     */
    callType: {
      setCallType: SetState<CallType>
    }
  }
  /**
   * Mutation
   */
  mutation: {
    /**
     * 通話キャンセル
     */
    cancel: {
      result?: CancelMutation['cancel']
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<CancelMutation, CancelMutationVariables>
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
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ReceiveCallProps, 'onCallingOpen' | 'state' | 'mutation'> & {
  loading: MutaionLoading
  onAcceptButtonClick: IconButtonProps['onClick']
  onDeclineButtonClick: IconButtonProps['onClick']
}

/** Presenter Component */
const ReceiveCallPresenter: React.VFC<PresenterProps> = ({
  subscription: { signaling },
  loading,
  onAcceptButtonClick,
  onDeclineButtonClick,
  ...props
}) => (
  <Modal {...props}>
    <ModalContent {...styles.content}>
      <ModalBody {...styles.body}>
        <Stack {...styles.container}>
          <Stack spacing='5'>
            <Avatar src={toStr(signaling.result?.txUserAvatar)} {...styles.avatar} />
            <Stack {...styles.info}>
              <Text {...styles.caller}>{toStr(signaling.result?.txUserName)}</Text>
              <Text {...styles.notice}>Incoming Call</Text>
            </Stack>
          </Stack>
          <HStack {...styles.actions}>
            <Stack {...styles.actionContainer}>
              <IconButton
                {...styles.acceptButton}
                aria-label='accept'
                icon={<ImPhone />}
                isLoading={loading}
                onClick={onAcceptButtonClick}
              />
              <Text {...styles.actionDesc}>Accept</Text>
            </Stack>
            <Stack {...styles.actionContainer}>
              <IconButton
                {...styles.declineButton}
                aria-label='decline'
                icon={<ImPhoneHangUp />}
                isLoading={loading}
                onClick={onDeclineButtonClick}
              />
              <Text {...styles.actionDesc}>Decline</Text>
            </Stack>
          </HStack>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const ReceiveCallContainer: React.VFC<ContainerProps<ReceiveCallProps, PresenterProps>> = ({
  presenter,
  onCallingOpen,
  state: { callType },
  mutation: { cancel },
  subscription: { signaling },
  ...props
}) => {
  // modal prop isCentered
  const isCentered = useBreakpointValue({ base: true, sm: false })

  // status
  const loading = cancel.loading

  // onClick accept button
  const onAcceptButtonClick = () => {
    callType.setCallType(CallType.Answer)
    onCallingOpen()
  }

  // onClick decline button
  const onDeclineButtonClick = () => {
    if (isNullish(signaling.result)) return
    const callId = signaling.result.callId
    cancel.reset()
    cancel.mutate({ variables: { callId } }).catch(toast('UnexpectedError'))
  }

  return presenter({
    isCentered,
    loading,
    onAcceptButtonClick,
    onDeclineButtonClick,
    subscription: { signaling },
    ...props
  })
}

/** ReceiveCall */
export default connect<ReceiveCallProps, PresenterProps>('ReceiveCall', ReceiveCallPresenter, ReceiveCallContainer)
