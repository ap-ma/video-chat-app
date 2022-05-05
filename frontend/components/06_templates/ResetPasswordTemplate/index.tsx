import { Heading } from '@chakra-ui/react'
import ResetPasswordForm, {
  ResetPasswordFormProps
} from 'components/04_organisms/forms/ResetPasswordForm'
import AuthForm from 'components/05_layouts/AuthForm'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** ResetPasswordTemplate Props */
export type ResetPasswordTemplateProps = Omit<HtmlSkeletonProps, 'children'> &
  ResetPasswordFormProps
/** Presenter Props */
type PresenterProps = ResetPasswordTemplateProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ token, errors, mutation, ...props }) => (
  <HtmlSkeleton {...props}>
    <Title>Reset Password</Title>
    <AuthForm>
      <Heading {...styles.head}>Enter new password</Heading>
      <ResetPasswordForm {...{ token, errors, mutation }} />
    </AuthForm>
  </HtmlSkeleton>
)

/** Container Component */
const Container: React.VFC<ContainerProps<ResetPasswordTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** ResetPasswordTemplate */
export default connect<ResetPasswordTemplateProps, PresenterProps>(
  'ResetPasswordTemplate',
  Presenter,
  Container
)
