import { Flex, Heading, Stack, useDisclosure } from '@chakra-ui/react'
import ResetPasswordCompleteDialog from 'components/04_organisms/_dialogs/ResetPasswordCompleteDialog'
import ResetPasswordForm from 'components/04_organisms/_forms/ResetPasswordForm'
import HtmlSkeleton, { Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import { ResetPasswordInput, ResetPasswordMutation, ResetPasswordMutationVariables } from 'graphql/generated'
import React, { useMemo } from 'react'
import { ContainerProps, Disclosure, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'
import * as styles from './styles'

/** ResetPasswordTemplate Props */
export type ResetPasswordTemplateProps = {
  /**
   * トークン
   */
  token?: ResetPasswordInput['token']
  /**
   * パスワードリセットトークン検証エラー
   */
  tokenErrors?: ValidationErrors
  /**
   * Mutation
   */
  mutation: {
    /**
     * パスワードリセット
     */
    resetPassword: {
      result?: ResetPasswordMutation['resetPassword']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ResetPasswordMutation, ResetPasswordMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = ResetPasswordTemplateProps & {
  rpcdDisc: Disclosure
}

/** Presenter Component */
const ResetPasswordTemplatePresenter: React.VFC<PresenterProps> = ({ token, tokenErrors, mutation, rpcdDisc }) => (
  <HtmlSkeleton>
    <Title>Reset Password</Title>
    <Flex {...styles.container}>
      <Stack {...styles.contents}>
        <Heading {...styles.head}>Enter new password</Heading>
        <ResetPasswordForm {...{ token, tokenErrors, mutation }} />
      </Stack>
    </Flex>
    <ResetPasswordCompleteDialog isOpen={rpcdDisc.isOpen} onClose={rpcdDisc.onClose} />
  </HtmlSkeleton>
)

/** Container Component */
const ResetPasswordTemplateContainer: React.VFC<ContainerProps<ResetPasswordTemplateProps, PresenterProps>> = ({
  presenter,
  mutation,
  ...props
}) => {
  // ResetPassword dialog
  const rpcdDisc = useDisclosure()

  // ResetPassword onComplete
  const onRpcdOpen = rpcdDisc.onOpen
  const resetPasswordResult = mutation.resetPassword.result
  useMemo(() => {
    if (resetPasswordResult) onRpcdOpen()
  }, [onRpcdOpen, resetPasswordResult])

  return presenter({
    mutation,
    rpcdDisc,
    ...props
  })
}

/** ResetPasswordTemplate */
export default connect<ResetPasswordTemplateProps, PresenterProps>(
  'ResetPasswordTemplate',
  ResetPasswordTemplatePresenter,
  ResetPasswordTemplateContainer
)
