import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Text, useBreakpointValue } from '@chakra-ui/react'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** ChangePasswordCompleteDialog Props */
export type ChangePasswordCompleteDialogProps = Omit<ModalProps, 'children'>
/** Presenter Props */
export type PresenterProps = ChangePasswordCompleteDialogProps

/** Presenter Component */
const ChangePasswordCompleteDialogPresenter: React.VFC<PresenterProps> = ({ onClose, ...props }) => (
  <Modal {...{ onClose, ...props }}>
    <ModalContent {...styles.content}>
      <ModalHeader {...styles.head}>Password changed</ModalHeader>
      <ModalBody>
        <Text {...styles.text}>Password change completed successfully.</Text>
        <Text {...styles.text}>Next time you sign in, please use the updated password.</Text>
      </ModalBody>
      <ModalFooter mt='-2px'>
        <Button {...styles.button} onClick={onClose}>
          OK
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

/** Container Component */
const ChangePasswordCompleteDialogContainer: React.VFC<
  ContainerProps<ChangePasswordCompleteDialogProps, PresenterProps>
> = ({ presenter, ...props }) => {
  // modal prop isCentered
  const isCentered = useBreakpointValue({ base: true, sm: false })
  return presenter({ isCentered, ...props })
}

/** ChangePasswordCompleteDialog */
export default connect<ChangePasswordCompleteDialogProps, PresenterProps>(
  'ChangePasswordCompleteDialog',
  ChangePasswordCompleteDialogPresenter,
  ChangePasswordCompleteDialogContainer
)
