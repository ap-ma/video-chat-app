import classnames from 'classnames'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Balloon Props */
export type BalloonProps = JSX.IntrinsicElements['span']
/** Presenter Props */
export type PresenterProps = BalloonProps

/** Presenter Component */
const BalloonPresenter: React.VFC<PresenterProps> = ({ children, className, ...props }) => (
  <span className={classnames(styles.root, className)} {...props}>
    {children}
  </span>
)

/** Container Component */
const BalloonContainer: React.VFC<ContainerProps<BalloonProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Balloon */
export default connect<BalloonProps, PresenterProps>('Balloon', BalloonPresenter, BalloonContainer)
