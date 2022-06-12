import classnames from 'classnames'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Bubble Props */
export type BubbleProps = JSX.IntrinsicElements['span']
/** Presenter Props */
export type PresenterProps = BubbleProps

/** Presenter Component */
const BubblePresenter: React.VFC<PresenterProps> = ({ children, className, ...props }) => (
  <span className={classnames(styles.root, className)} {...props}>
    {children}
  </span>
)

/** Container Component */
const BubbleContainer: React.VFC<ContainerProps<BubbleProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Bubble */
export default connect<BubbleProps, PresenterProps>('Bubble', BubblePresenter, BubbleContainer)
