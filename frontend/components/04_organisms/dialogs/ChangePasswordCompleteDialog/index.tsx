import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Text } from '@chakra-ui/react'
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
  <Modal isCentered {...{ onClose, ...props }}>
    <ModalContent>
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
  return presenter({ ...props })
}

/** ChangePasswordCompleteDialog */
export default connect<ChangePasswordCompleteDialogProps, PresenterProps>(
  'ChangePasswordCompleteDialog',
  ChangePasswordCompleteDialogPresenter,
  ChangePasswordCompleteDialogContainer
)
