import classnames from 'classnames'
import { connect } from 'components/hoc'
import React, { Children, cloneElement, useMemo } from 'react'
import { ContainerProps } from 'types'
import { hashCode } from 'utils/general/helper'
import { includes, isReactElement } from 'utils/general/object'
import Marker from './Marker'
import * as styles from './styles'
import Tip from './Tip'

/** Tooltip Props */
export type TooltipProps = JSX.IntrinsicElements['span']
/** Presenter Props */
type PresenterProps = TooltipProps

/** Presenter Component */
const TooltipPresenter: React.VFC<PresenterProps> = ({ children, className, ...props }) => (
  <span className={classnames(styles.root, className)} {...props}>
    {children}
  </span>
)

/** Container Component */
const TooltipContainer: React.VFC<ContainerProps<TooltipProps, PresenterProps>> = ({
  presenter,
  children,
  className,
  ...props
}) => {
  const rootClassName = useMemo(() => `tooltip-${hashCode(props)}`, [props])
  children = Children.map(children, (child) =>
    isReactElement(child) && includes(child.type, Tip, Marker) ? cloneElement(child, { rootClassName }) : child
  )
  className = classnames(rootClassName, className)
  return presenter({ children, className, ...props })
}

/** Tooltip */
export default connect<TooltipProps, PresenterProps>('Tooltip', TooltipPresenter, TooltipContainer)

// Sub Component
export type { MarkerProps } from './Marker'
export type { TipProps } from './Tip'
export { Marker, Tip }
