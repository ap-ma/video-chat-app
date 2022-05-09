import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Text } from '@chakra-ui/react'
import Modal, { ModalProps } from 'components/03_molecules/Modal'
import { connect } from 'components/hoc'
import { VERIFICATION_LINK_EXPIRATION_MINUTES } from 'const'
import React from 'react'
import { ContainerProps } from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** SignupCompleteDialog Props */
export type SignupCompleteDialogProps = Omit<ModalProps, 'children'>

/** Presenter Props */
type PresenterProps = SignupCompleteDialogProps & {
  expirationMinutes: string
}

/** Presenter Component */
const SignupCompleteDialogPresenter: React.VFC<PresenterProps> = ({ expirationMinutes, onClose, ...props }) => (
  <Modal isCentered {...{ onClose, ...props }}>
    <ModalContent>
      <ModalHeader {...styles.head}>Verification email sent</ModalHeader>
      <ModalBody>
        <Text>A verification email had been sent to your email address.</Text>
        <Text>The verification link will expire after {expirationMinutes} minutes.</Text>
        <Text>After verifying your email address, your account will be activated and you will be able to sign in.</Text>
      </ModalBody>
      <ModalFooter mt='-10px'>
        <Button {...styles.button} onClick={onClose}>
          OK
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

/** Container Component */
const SignupCompleteDialogContainer: React.VFC<ContainerProps<SignupCompleteDialogProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  const expirationMinutes = toStr(VERIFICATION_LINK_EXPIRATION_MINUTES)
  return presenter({ expirationMinutes, ...props })
}

/** SignupCompleteDialog */
export default connect<SignupCompleteDialogProps, PresenterProps>(
  'SignupCompleteDialog',
  SignupCompleteDialogPresenter,
  SignupCompleteDialogContainer
)
