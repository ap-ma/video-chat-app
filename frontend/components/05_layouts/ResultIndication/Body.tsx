import { connect } from 'components/hoc'
import React, { Fragment } from 'react'
import { ContainerProps, WithChildren } from 'types'

/** Body Props */
export type BodyProps = WithChildren
type PresenterProps = BodyProps

/** Presenter Component */
const BodyPresenter: React.VFC<PresenterProps> = ({ children }) => <Fragment>{children}</Fragment>

/** Container Component */
const BodyContainer: React.VFC<ContainerProps<BodyProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Body */
export default connect<BodyProps, PresenterProps>('Body', BodyPresenter, BodyContainer)
