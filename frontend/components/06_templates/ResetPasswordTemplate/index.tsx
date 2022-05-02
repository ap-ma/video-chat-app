import Layout, { Title } from 'components/05_layouts/Layout'
import { connect } from 'components/hoc'
import {
  IsPasswordResetTokenValidQuery,
  ResetPasswordInput,
  ResetPasswordMutation,
  ResetPasswordMutationVariables
} from 'graphql/generated'
import React from 'react'
import {
  ContainerProps,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  ValidationErrors
} from 'types'

/** ResetPasswordTemplate Props */
export type ResetPasswordTemplateProps = {
  /**
   * トークン
   */
  token?: ResetPasswordInput['token']
  /**
   * パスワードリセットトークン検証結果
   */
  result?: IsPasswordResetTokenValidQuery['isPasswordResetTokenValid']
  /**
   * パスワードリセットトークン検証エラー
   */
  errors?: ValidationErrors
  /**
   * Mutation
   */
  mutation: {
    // パスワードリセット
    resetPassword: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      resetPassword: MutateFunction<ResetPasswordMutation, ResetPasswordMutationVariables>
    }
  }
}
/** Presenter Props */
type PresenterProps = ResetPasswordTemplateProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = () => (
  <Layout>
    <Title>Reset Password</Title>
  </Layout>
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
