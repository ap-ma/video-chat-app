import { Box as Spacer, Icon, ModalBody, ModalContent, ModalHeader, Text } from '@chakra-ui/react'
import Link from 'components/01_atoms/Link'
import Modal, { ModalProps } from 'components/03_molecules/Modal'
import { connect } from 'components/hoc'
import { SIGNIN_PAGE } from 'const'
import React from 'react'
import { RiCheckboxCircleLine } from 'react-icons/ri'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** EmailVerificationSuccessDialog Props */
export type EmailVerificationSuccessDialogProps = Omit<ModalProps, 'children'>

/** Presenter Props */
export type PresenterProps = EmailVerificationSuccessDialogProps

/** Presenter Component */
const EmailVerificationSuccessDialogPresenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Modal isCentered size='lg' {...props}>
    <ModalContent pb='3'>
      <Icon as={RiCheckboxCircleLine} {...styles.icon} />
      <ModalHeader {...styles.head}>Email Verified</ModalHeader>
      <ModalBody textAlign='center'>
        <Text {...styles.text}>Email verification has been completed.</Text>
        <Text {...styles.text}>Click the link below to go to the sign in page.</Text>
        <Spacer p='1.5' />
        <Link href={SIGNIN_PAGE} color='blue.400'>
          Sign in
        </Link>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const EmailVerificationSuccessDialogContainer: React.VFC<
  ContainerProps<EmailVerificationSuccessDialogProps, PresenterProps>
> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** EmailVerificationSuccessDialog */
export default connect<EmailVerificationSuccessDialogProps, PresenterProps>(
  'EmailVerificationSuccessDialog',
  EmailVerificationSuccessDialogPresenter,
  EmailVerificationSuccessDialogContainer
)
