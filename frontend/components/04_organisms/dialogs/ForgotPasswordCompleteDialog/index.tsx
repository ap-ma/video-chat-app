import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Text } from '@chakra-ui/react'
import Modal, { ModalProps } from 'components/03_molecules/Modal'
import { connect } from 'components/hoc'
import { PASSWORD_RESET_LINK_EXPIRATION_MINUTES } from 'const'
import React from 'react'
import { ContainerProps } from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** ForgotPasswordCompleteDialog Props */
export type ForgotPasswordCompleteDialogProps = Omit<ModalProps, 'children'>

/** Presenter Props */
type PresenterProps = ForgotPasswordCompleteDialogProps & {
  expirationMinutes: string
}

/** Presenter Component */
const ForgotPasswordCompleteDialogPresenter: React.VFC<PresenterProps> = ({ expirationMinutes, onClose, ...props }) => (
  <Modal isCentered {...{ onClose, ...props }}>
    <ModalContent>
      <ModalHeader {...styles.head}>Password reset link sent</ModalHeader>
      <ModalBody>
        <Text {...styles.text}>An email with a password reset link had been sent to your email address.</Text>
        <Text {...styles.text}>The password reset link will expire after {expirationMinutes} minutes.</Text>
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
const ForgotPasswordCompleteDialogContainer: React.VFC<
  ContainerProps<ForgotPasswordCompleteDialogProps, PresenterProps>
> = ({ presenter, ...props }) => {
  const expirationMinutes = toStr(PASSWORD_RESET_LINK_EXPIRATION_MINUTES)
  return presenter({ expirationMinutes, ...props })
}

/** ForgotPasswordCompleteDialog */
export default connect<ForgotPasswordCompleteDialogProps, PresenterProps>(
  'ForgotPasswordCompleteDialog',
  ForgotPasswordCompleteDialogPresenter,
  ForgotPasswordCompleteDialogContainer
)
