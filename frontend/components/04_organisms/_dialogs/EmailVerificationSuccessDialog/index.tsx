import { Box as Spacer, Icon, ModalBody, ModalContent, ModalHeader, Text, useBreakpointValue } from '@chakra-ui/react'
import Link from 'components/01_atoms/Link'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import { connect } from 'components/hoc'
import { INDEX_PAGE } from 'const'
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
  <Modal isCentered {...props}>
    <ModalContent pb='4'>
      <Icon as={RiCheckboxCircleLine} {...styles.icon} />
      <ModalHeader {...styles.head}>Email Verified</ModalHeader>
      <ModalBody textAlign='center'>
        <Text {...styles.text}>Email verification has been completed.</Text>
        <Text {...styles.text}>Click on the link below.</Text>
        <Spacer p='1.5' />
        <Link href={INDEX_PAGE} color='blue.400'>
          move
        </Link>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const EmailVerificationSuccessDialogContainer: React.VFC<
  ContainerProps<EmailVerificationSuccessDialogProps, PresenterProps>
> = ({ presenter, ...props }) => {
  // modal prop size
  const size = useBreakpointValue({ base: 'md', sm: 'lg' })
  return presenter({ size, ...props })
}

/** EmailVerificationSuccessDialog */
export default connect<EmailVerificationSuccessDialogProps, PresenterProps>(
  'EmailVerificationSuccessDialog',
  EmailVerificationSuccessDialogPresenter,
  EmailVerificationSuccessDialogContainer
)
