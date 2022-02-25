import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import { classNames } from 'utils'
import * as styles from './styles'

/** Balloon Props */
export type BalloonProps = JSX.IntrinsicElements['span']
/** Presenter Props */
type PresenterProps = BalloonProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ children, className, ...props }) => (
  <span className={classNames(styles.root, className)} {...props}>
    {children}
  </span>
)

/** Container Component */
const Container: React.VFC<ContainerProps<BalloonProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** Balloon */
export default connect<BalloonProps, PresenterProps>('Balloon', Presenter, Container)
