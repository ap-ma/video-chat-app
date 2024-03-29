import { Box, BoxProps, Icon } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { ChakraColors, ContainerProps } from 'types'
import { hashCode } from 'utils/general/helper'
import * as styles from './styles'

/** Wave Props */
export type WaveProps = BoxProps &
  Partial<{
    /**
     * 上段の色
     */
    topColor: ChakraColors
    /**
     * 下段の色
     */
    bottomColor: ChakraColors
    /**
     * 開始後何秒後周期のアニメーション状態でアニメーションを開始するかを指定
     */
    animationNegativeDelay: number
  }>

/** Presenter Props */
export type PresenterProps = WaveProps & { id: string }

/** Presenter Component */
const WavePresenter: React.VFC<PresenterProps> = ({ id, topColor, bottomColor, animationNegativeDelay, ...props }) => (
  <Box bg={topColor} {...props}>
    <Icon {...styles.waveBorder({ bottomColor })}>
      <defs>
        <path id={id} d='M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z' />
      </defs>
      <g className={styles.parallax({ animationNegativeDelay })}>
        <use href={`#${id}`} x='48' y='0' fill='currentColor' />
      </g>
    </Icon>
  </Box>
)

/** Container Component */
const WaveContainer: React.VFC<ContainerProps<WaveProps, PresenterProps>> = ({
  presenter,
  topColor = '#4829B2',
  bottomColor = '#FFFFFF',
  animationNegativeDelay = 0,
  ...props
}) => {
  const id = `wave-${hashCode(props)}`
  return presenter({ id, topColor, bottomColor, animationNegativeDelay, ...props })
}

/** Wave */
export default connect<WaveProps, PresenterProps>('Wave', WavePresenter, WaveContainer)
