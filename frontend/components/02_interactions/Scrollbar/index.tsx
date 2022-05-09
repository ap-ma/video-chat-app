import { Box, BoxProps } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Scrollbar Props */
export type ScrollbarProps = BoxProps
/** Presenter Props */
type PresenterProps = ScrollbarProps

/** Presenter Component */
const ScrollbarPresenter: React.VFC<PresenterProps> = ({ children, ...props }) => (
  <Box {...styles.root} {...props}>
    {children}
  </Box>
)

/** Container Component */
const ScrollbarContainer: React.VFC<ContainerProps<ScrollbarProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Scrollbar */
export default connect<ScrollbarProps, PresenterProps>('Scrollbar', ScrollbarPresenter, ScrollbarContainer)
