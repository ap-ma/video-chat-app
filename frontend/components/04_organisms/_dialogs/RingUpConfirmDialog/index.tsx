import { ButtonProps } from '@chakra-ui/react'
import ConfirmDialog, { ConfirmDialogProps } from 'components/03_molecules/ConfirmDialog'
import { connect } from 'components/hoc'
import React from 'react'
import { CallType, ContainerProps, OnOpen, SetState } from 'types'
import * as styles from './styles'

/** RingUpConfirmDialog Props */
export type RingUpConfirmDialogProps = Omit<ConfirmDialogProps, 'children' | 'header' | 'body' | 'ok' | 'cancel'> & {
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
}

/** Presenter Props */
export type PresenterProps = Omit<RingUpConfirmDialogProps, 'onCallingOpen' | 'state'> & {
  onOkButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const RingUpConfirmDialogPresenter: React.VFC<PresenterProps> = ({ onClose, onOkButtonClick, ...props }) => (
  <ConfirmDialog
    header='Ring up'
    body='Do you want to make a call?'
    ok={{ ...styles.ok, children: 'OK', onClick: onOkButtonClick }}
    cancel={{ w: 'full', children: 'Cancel', onClick: onClose }}
    {...{ onClose, ...props }}
  />
)

/** Container Component */
const RingUpConfirmDialogContainer: React.VFC<ContainerProps<RingUpConfirmDialogProps, PresenterProps>> = ({
  presenter,
  onCallingOpen,
  state: { callType },
  ...props
}) => {
  const onOkButtonClick = () => {
    callType.setCallType(CallType.Offer)
    onCallingOpen()
  }

  return presenter({ onOkButtonClick, ...props })
}

/** RingUpConfirmDialog */
export default connect<RingUpConfirmDialogProps, PresenterProps>(
  'RingUpConfirmDialog',
  RingUpConfirmDialogPresenter,
  RingUpConfirmDialogContainer
)
