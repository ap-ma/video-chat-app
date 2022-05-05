import { Flex, FlexProps, Stack } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'

/** AuthForm Props */
export type AuthFormProps = FlexProps & WithChildren
/** Presenter Props */
type PresenterProps = AuthFormProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ children, ...props }) => (
  <Flex {...styles.root} {...props}>
    <Stack {...styles.stack}>{children}</Stack>
  </Flex>
)

/** Container Component */
const Container: React.VFC<ContainerProps<AuthFormProps, PresenterProps>> = ({
  presenter,
  bg = 'gray.50',
  ...props
}) => {
  return presenter({ bg, ...props })
}

/** AuthForm */
export default connect<AuthFormProps, PresenterProps>('AuthForm', Presenter, Container)
