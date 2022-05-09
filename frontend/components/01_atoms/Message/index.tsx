import { Box, BoxProps, Text, TextProps } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { ChakraColors, ContainerProps } from 'types'
import * as styles from './styles'

/** Message Props */
export type MessageProps = Omit<BoxProps, 'children' | 'bgColor'> &
  Pick<TextProps, 'children'> & {
    /**
     * 吹き出しの三角マークの位置
     */
    triangleMarkPosition: 'left' | 'right' | 'none'
    /**
     * 吹き出しの背景色
     */
    bgColor?: ChakraColors
    /**
     * 吹き出しの文字色
     */
    textColor?: ChakraColors
    /**
     * テキストに合わせて横幅を伸縮させるか否か
     */
    autoSizing?: boolean
  }

/** Presenter Props */
type PresenterProps = MessageProps

/** Presenter Component */
const MessagePresenter: React.VFC<PresenterProps> = ({
  triangleMarkPosition,
  bgColor,
  textColor,
  autoSizing,
  children,
  ...props
}) => (
  <Box {...styles.root({ triangleMarkPosition, bgColor, autoSizing })} {...props}>
    <Text {...styles.content({ textColor })}>{children}</Text>
  </Box>
)

/** Container Component */
const MessageContainer: React.VFC<ContainerProps<MessageProps, PresenterProps>> = ({
  presenter,
  bgColor = 'gray.50',
  textColor = 'black',
  ...props
}) => {
  return presenter({ bgColor, textColor, ...props })
}

/** Message */
export default connect<MessageProps, PresenterProps>('Message', MessagePresenter, MessageContainer)
