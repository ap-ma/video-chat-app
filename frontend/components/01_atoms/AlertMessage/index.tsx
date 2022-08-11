import { Alert, AlertIcon, AlertProps } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React, { Fragment } from 'react'
import { ContainerProps } from 'types'
import { isArray, isNullish } from 'utils/general/object'
import * as styles from './styles'

/** AlertMessage Props */
export type AlertMessageProps = AlertProps & {
  error: string | string[] | undefined
}

/** Presenter Props */
export type PresenterProps = Omit<AlertMessageProps, 'error'> & {
  errors: string[] | undefined
}

/** Presenter Component */
const AlertMessagePresenter: React.VFC<PresenterProps> = ({ errors, ...props }) => (
  <Fragment>
    {errors?.map((msg, i) => (
      <Alert {...styles.alert(i)} {...props} key={i}>
        <AlertIcon /> {msg}
      </Alert>
    ))}
  </Fragment>
)

/** Container Component */
const AlertMessageContainer: React.VFC<ContainerProps<AlertMessageProps, PresenterProps>> = ({
  presenter,
  error,
  ...props
}) => {
  const errors = isNullish(error) || isArray(error) ? error : [error]
  return presenter({ errors, ...props })
}

/** AlertMessage */
export default connect<AlertMessageProps, PresenterProps>('AlertMessage', AlertMessagePresenter, AlertMessageContainer)
