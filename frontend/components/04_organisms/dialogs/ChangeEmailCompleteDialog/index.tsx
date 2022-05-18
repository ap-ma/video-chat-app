import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Text } from '@chakra-ui/react'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import { connect } from 'components/hoc'
import { EMAIL_VERIFICATION_LINK_EXPIRATION_MINUTES } from 'const'
import React from 'react'
import { ContainerProps } from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** ChangeEmailCompleteDialog Props */
export type ChangeEmailCompleteDialogProps = Omit<ModalProps, 'children'>

/** Presenter Props */
export type PresenterProps = ChangeEmailCompleteDialogProps & {
  expirationMinutes: string
}

/** Presenter Component */
const ChangeEmailCompleteDialogPresenter: React.VFC<PresenterProps> = ({ expirationMinutes, onClose, ...props }) => (
  <Modal isCentered {...{ onClose, ...props }}>
    <ModalContent>
      <ModalHeader {...styles.head}>Verification email sent</ModalHeader>
      <ModalBody>
        <Text {...styles.text}>A verification email has been sent to new email address.</Text>
        <Text {...styles.text}>The verification link will expire after {expirationMinutes} minutes.</Text>
        <Text {...styles.text}>After verifying your email address, your email address will be switched.</Text>
      </ModalBody>
      <ModalFooter mt='-5px'>
        <Button {...styles.button} onClick={onClose}>
          OK
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

/** Container Component */
const ChangeEmailCompleteDialogContainer: React.VFC<ContainerProps<ChangeEmailCompleteDialogProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  const expirationMinutes = toStr(EMAIL_VERIFICATION_LINK_EXPIRATION_MINUTES)
  return presenter({ expirationMinutes, ...props })
}

/** ChangeEmailCompleteDialog */
export default connect<ChangeEmailCompleteDialogProps, PresenterProps>(
  'ChangeEmailCompleteDialog',
  ChangeEmailCompleteDialogPresenter,
  ChangeEmailCompleteDialogContainer
)
