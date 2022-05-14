import { Flex, Heading, Stack, useDisclosure } from '@chakra-ui/react'
import ResetPasswordCompleteDialog from 'components/04_organisms/dialogs/ResetPasswordCompleteDialog'
import ResetPasswordForm from 'components/04_organisms/forms/ResetPasswordForm'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import { ResetPasswordInput, ResetPasswordMutation, ResetPasswordMutationVariables } from 'graphql/generated'
import React, { useMemo } from 'react'
import { ContainerProps, IsOpen, MutaionLoading, MutaionReset, MutateFunction, OnClose, ValidationErrors } from 'types'
import * as styles from './styles'

/** ResetPasswordTemplate Props */
export type ResetPasswordTemplateProps = Omit<HtmlSkeletonProps, 'children'> & {
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
  isRpcdOpen: IsOpen
  onRpcdClose: OnClose
}

/** Presenter Component */
const ResetPasswordTemplatePresenter: React.VFC<PresenterProps> = ({
  token,
  tokenErrors,
  mutation,
  isRpcdOpen,
  onRpcdClose,
  ...props
}) => (
  <HtmlSkeleton {...props}>
    <Title>Reset Password</Title>
    <Flex {...styles.container} {...props}>
      <Stack {...styles.contents}>
        <Heading {...styles.head}>Enter new password</Heading>
        <ResetPasswordForm {...{ token, tokenErrors, mutation }} />
      </Stack>
    </Flex>
    <ResetPasswordCompleteDialog isOpen={isRpcdOpen} onClose={onRpcdClose} />
  </HtmlSkeleton>
)

/** Container Component */
const ResetPasswordTemplateContainer: React.VFC<ContainerProps<ResetPasswordTemplateProps, PresenterProps>> = ({
  presenter,
  mutation,
  ...props
}) => {
  const { isOpen: isRpcdOpen, onOpen: onRpcdOpen, onClose: onRpcdClose } = useDisclosure()

  useMemo(() => {
    if (mutation.resetPassword.result) {
      onRpcdOpen()
      mutation.resetPassword.reset()
    }
  }, [mutation, onRpcdOpen])

  return presenter({
    mutation,
    isRpcdOpen,
    onRpcdClose,
    ...props
  })
}

/** ResetPasswordTemplate */
export default connect<ResetPasswordTemplateProps, PresenterProps>(
  'ResetPasswordTemplate',
  ResetPasswordTemplatePresenter,
  ResetPasswordTemplateContainer
)
