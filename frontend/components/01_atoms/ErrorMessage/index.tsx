import { Text, TextProps } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React, { Fragment } from 'react'
import { ContainerProps } from 'types'
import { isArray, isNullish } from 'utils/general/object'
import * as styles from './styles'

/** ErrorMessage Props */
export type ErrorMessageProps = TextProps & {
  error: string | string[] | undefined
}

/** Presenter Props */
export type PresenterProps = Omit<ErrorMessageProps, 'error'> & {
  errors: string[] | undefined
}

/** Presenter Component */
const ErrorMessagePresenter: React.VFC<PresenterProps> = ({ errors, ...props }) => (
  <Fragment>
    {errors?.map((msg, i) => (
      <Text {...styles.message} {...props} key={i}>
        {msg}
      </Text>
    ))}
  </Fragment>
)

/** Container Component */
const ErrorMessageContainer: React.VFC<ContainerProps<ErrorMessageProps, PresenterProps>> = ({
  presenter,
  error,
  ...props
}) => {
  const errors = isNullish(error) || isArray(error) ? error : [error]
  return presenter({ errors, ...props })
}

/** ErrorMessage */
export default connect<ErrorMessageProps, PresenterProps>('ErrorMessage', ErrorMessagePresenter, ErrorMessageContainer)
