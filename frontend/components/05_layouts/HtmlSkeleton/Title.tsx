import { connect } from 'components/hoc'
import React, { Fragment, ReactText } from 'react'
import { ContainerProps } from 'types'

/** Title Props */
export type TitleProps = { children: ReactText }
type PresenterProps = TitleProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ children }) => <Fragment>{children}</Fragment>

/** Container Component */
const Container: React.VFC<ContainerProps<TitleProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** Title */
export default connect<TitleProps, PresenterProps>('Title', Presenter, Container)
