import { Box, BoxProps } from '@chakra-ui/react'
import { connectRef } from 'components/hoc'
import React, { forwardRef, Ref } from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Scrollbar Props */
export type ScrollbarProps = BoxProps

/** Presenter Props */
export type PresenterProps = ScrollbarProps & {
  ref: Ref<HTMLDivElement>
}

/** Presenter Component */
const ScrollbarPresenter = forwardRef<HTMLDivElement, Omit<PresenterProps, 'ref'>>(({ children, ...props }, ref) => (
  <Box {...styles.root} ref={ref} {...props}>
    {children}
  </Box>
))

/** Container Component */
const ScrollbarContainer = forwardRef<HTMLDivElement, ContainerProps<ScrollbarProps, PresenterProps>>(
  ({ presenter, ...props }, ref) => {
    return presenter({ ref, ...props })
  }
)

// display name
ScrollbarPresenter.displayName = 'ScrollbarPresenter'
ScrollbarContainer.displayName = 'ScrollbarContainer'

/** Scrollbar */
export default connectRef<HTMLDivElement, ScrollbarProps, PresenterProps>(
  'Scrollbar',
  ScrollbarPresenter,
  ScrollbarContainer
)
