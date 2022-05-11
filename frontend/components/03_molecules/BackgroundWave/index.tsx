import { Box } from '@chakra-ui/react'
import Wave, { WaveProps } from 'components/01_atoms/Wave'
import { connect } from 'components/hoc'
import React, { Fragment } from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'

/** BackgroundWave Props */
export type BackgroundWaveProps = WaveProps & WithChildren
/** Presenter Props */
export type PresenterProps = BackgroundWaveProps

/** Presenter Component */
const BackgroundWavePresenter: React.VFC<PresenterProps> = ({
  topColor,
  bottomColor,
  animationNegativeDelay,
  children,
  ...props
}) => (
  <Fragment>
    {children}
    <Box {...styles.container({ bottomColor })}>
      <Box {...styles.top({ topColor })} />
      <Wave topColor={topColor} bottomColor={bottomColor} animationNegativeDelay={animationNegativeDelay} {...props} />
    </Box>
  </Fragment>
)

/** Container Component */
const BackgroundWaveContainer: React.VFC<ContainerProps<BackgroundWaveProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** BackgroundWave */
export default connect<BackgroundWaveProps, PresenterProps>(
  'BackgroundWave',
  BackgroundWavePresenter,
  BackgroundWaveContainer
)
