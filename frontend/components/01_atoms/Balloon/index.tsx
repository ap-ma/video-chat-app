import { Box, BoxProps, TextProps } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { ChakraColors, ContainerProps } from 'types'
import * as styles from './styles'

/** Balloon Props */
export type BalloonProps = Omit<BoxProps, 'children' | 'bgColor'> &
  Pick<TextProps, 'children'> & {
    /**
     * 吹き出しの三角マークの位置
     */
    tailPosition: 'left' | 'right' | 'none'
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
export type PresenterProps = BalloonProps

/** Presenter Component */
const BalloonPresenter: React.VFC<PresenterProps> = ({ tailPosition, bgColor, autoSizing, children, ...props }) => (
  <Box {...styles.root({ tailPosition, bgColor, autoSizing })} {...props}>
    {children}
  </Box>
)

/** Container Component */
const BalloonContainer: React.VFC<ContainerProps<BalloonProps, PresenterProps>> = ({
  presenter,
  bgColor = 'gray.50',
  textColor = 'black',
  ...props
}) => {
  return presenter({ bgColor, textColor, ...props })
}

/** Balloon */
export default connect<BalloonProps, PresenterProps>('Balloon', BalloonPresenter, BalloonContainer)
