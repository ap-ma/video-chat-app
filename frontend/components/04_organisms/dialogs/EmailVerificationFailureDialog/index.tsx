import { Icon, ModalBody, ModalContent, ModalHeader, Text, useBreakpointValue } from '@chakra-ui/react'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import { connect } from 'components/hoc'
import React from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** EmailVerificationFailureDialog Props */
export type EmailVerificationFailureDialogProps = Omit<ModalProps, 'children'>

/** Presenter Props */
export type PresenterProps = EmailVerificationFailureDialogProps

/** Presenter Component */
const EmailVerificationFailureDialogPresenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Modal isCentered {...props}>
    <ModalContent pb='5'>
      <Icon as={RiErrorWarningLine} {...styles.icon} />
      <ModalHeader {...styles.head}>Verification Failure</ModalHeader>
      <ModalBody textAlign='center'>
        <Text {...styles.text}>URL is incorrect or expired.</Text>
        <Text {...styles.text}>Please try the operation again.</Text>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const EmailVerificationFailureDialogContainer: React.VFC<
  ContainerProps<EmailVerificationFailureDialogProps, PresenterProps>
> = ({ presenter, ...props }) => {
  // modal prop size
  const size = useBreakpointValue({ base: 'md', sm: 'lg' })
  return presenter({ size, ...props })
}

/** EmailVerificationFailureDialog */
export default connect<EmailVerificationFailureDialogProps, PresenterProps>(
  'EmailVerificationFailureDialog',
  EmailVerificationFailureDialogPresenter,
  EmailVerificationFailureDialogContainer
)
