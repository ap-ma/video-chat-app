import { connect } from 'components/hoc'
import { nanoid } from 'nanoid'
import React, { Children, cloneElement, useMemo } from 'react'
import { ContainerProps } from 'types'
import { classNames, includes, isReactElement } from 'utils'
import Marker from './Marker'
import * as styles from './styles'
import Tip from './Tip'

/** Tooltip Props */
export type TooltipProps = JSX.IntrinsicElements['span']
/** Presenter Props */
type PresenterProps = TooltipProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ children, className, ...props }) => (
  <span className={classNames(styles.root, className)} {...props}>
    {children}
  </span>
)

/** Container Component */
const Container: React.VFC<ContainerProps<TooltipProps, PresenterProps>> = ({
  presenter,
  children,
  ...props
}) => {
  const className = useMemo(() => `css-${nanoid()}`, [])
  children = Children.map(children, (child) =>
    isReactElement(child) && includes(child.type, Tip, Marker)
      ? cloneElement(child, { rootClassName: className })
      : child
  )
  return presenter({ children, className, ...props })
}

/** Tooltip */
export default connect<TooltipProps, PresenterProps>('Tooltip', Presenter, Container)

// Sub Component
export type { MarkerProps } from './Marker'
export type { TipProps } from './Tip'
export { Marker, Tip }
