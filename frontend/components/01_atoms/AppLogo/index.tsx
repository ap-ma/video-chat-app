import { Heading, HeadingProps } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import { APP_NAME } from 'const'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** AppLogo Props */
export type AppLogoProps = HeadingProps
/** Presenter Props */
export type PresenterProps = AppLogoProps

/** Presenter Component */
const AppLogoPresenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Heading {...styles.root} {...props}>
    {APP_NAME}
  </Heading>
)

/** Container Component */
const AppLogoContainer: React.VFC<ContainerProps<AppLogoProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** AppLogo */
export default connect<AppLogoProps, PresenterProps>('AppLogo', AppLogoPresenter, AppLogoContainer)
