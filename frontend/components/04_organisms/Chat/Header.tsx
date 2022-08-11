import { Box, BoxProps, Spinner } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Header Props */
export type HeaderProps = BoxProps & {
  context?: { loading?: boolean }
}

export type PresenterProps = HeaderProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ context, ...props }) => (
  <Box {...styles.spinner({ context })} {...props}>
    <Spinner />
  </Box>
)

/** Container Component */
const Container: React.VFC<ContainerProps<HeaderProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Header */
export default connect<HeaderProps, PresenterProps>('Header', Presenter, Container)
