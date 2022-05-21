import { Box, BoxProps } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Chat Props */
export type ChatProps = BoxProps
/** Presenter Props */
export type PresenterProps = ChatProps

/** Presenter Component */
const ChatPresenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Box {...styles.root} {...props}>
    Home
  </Box>
)

/** Container Component */
const ChatContainer: React.VFC<ContainerProps<ChatProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Chat */
export default connect<ChatProps, PresenterProps>('Chat', ChatPresenter, ChatContainer)
