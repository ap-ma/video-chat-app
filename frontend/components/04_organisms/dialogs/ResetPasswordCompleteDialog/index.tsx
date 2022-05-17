import { Box as Spacer, ModalBody, ModalContent, ModalHeader, Text } from '@chakra-ui/react'
import Link from 'components/01_atoms/Link'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import { connect } from 'components/hoc'
import { SIGNIN_PAGE } from 'const'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** ResetPasswordCompleteDialog Props */
export type ResetPasswordCompleteDialogProps = Omit<ModalProps, 'children'>

/** Presenter Props */
export type PresenterProps = ResetPasswordCompleteDialogProps

/** Presenter Component */
const ResetPasswordCompleteDialogPresenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Modal isCentered size='lg' {...props}>
    <ModalContent pb='3'>
      <ModalHeader {...styles.head}>Password reset</ModalHeader>
      <ModalBody textAlign='center'>
        <Text {...styles.text}>Password reset has been completed.</Text>
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
const ResetPasswordCompleteDialogContainer: React.VFC<
  ContainerProps<ResetPasswordCompleteDialogProps, PresenterProps>
> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** ResetPasswordCompleteDialog */
export default connect<ResetPasswordCompleteDialogProps, PresenterProps>(
  'ResetPasswordCompleteDialog',
  ResetPasswordCompleteDialogPresenter,
  ResetPasswordCompleteDialogContainer
)
