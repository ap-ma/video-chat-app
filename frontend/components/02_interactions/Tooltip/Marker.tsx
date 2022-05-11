import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'

/** Marker Props */
export type MarkerProps = WithChildren & {
  /**
   * マーカーの色
   */
  mkColor?: string
  /**
   * ホバー指定ルート要素のクラス名
   */
  rootClassName?: string
}

export type PresenterProps = MarkerProps

/** Presenter Component */
const MarkerPresenter: React.VFC<PresenterProps> = ({ children, ...props }) => (
  <span className={styles.marker(props)}>{children}</span>
)

/** Container Component */
const MarkerContainer: React.VFC<ContainerProps<MarkerProps, PresenterProps>> = ({
  presenter,
  mkColor = '#9DECF9',
  ...props
}) => {
  return presenter({ mkColor, ...props })
}

/** Marker */
export default connect<MarkerProps, PresenterProps>('Marker', MarkerPresenter, MarkerContainer)
