import { connect } from 'components/hoc'
import React, { Fragment } from 'react'
import { ContainerProps, WithChildren } from 'types'

/** Head Props */
export type HeadProps = WithChildren
type PresenterProps = HeadProps

/** Presenter Component */
const HeadPresenter: React.VFC<PresenterProps> = ({ children }) => <Fragment>{children}</Fragment>

/** Container Component */
const HeadContainer: React.VFC<ContainerProps<HeadProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Head */
export default connect<HeadProps, PresenterProps>('Head', HeadPresenter, HeadContainer)
