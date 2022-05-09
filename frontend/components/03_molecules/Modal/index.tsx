import {
  Modal as ChakraModal,
  ModalOverlay as ChakraModalOverlay,
  ModalProps as ChakraModalProps
} from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Modal Props */
export type ModalProps = ChakraModalProps
/** Presenter Props */
type PresenterProps = ModalProps

/** Presenter Component */
const ModalPresenter: React.VFC<PresenterProps> = ({ children, ...props }) => (
  <ChakraModal {...styles.root} {...props}>
    <ChakraModalOverlay {...styles.overlay} />
    {children}
  </ChakraModal>
)

/** Container Component */
const ModalContainer: React.VFC<ContainerProps<ModalProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Modal */
export default connect<ModalProps, PresenterProps>('Modal', ModalPresenter, ModalContainer)
