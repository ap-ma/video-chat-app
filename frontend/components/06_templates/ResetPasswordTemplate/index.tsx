import { Flex, Heading, Stack } from '@chakra-ui/react'
import ResetPasswordForm, { ResetPasswordFormProps } from 'components/04_organisms/forms/ResetPasswordForm'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** ResetPasswordTemplate Props */
export type ResetPasswordTemplateProps = Omit<HtmlSkeletonProps, 'children'> & ResetPasswordFormProps
/** Presenter Props */
type PresenterProps = ResetPasswordTemplateProps

/** Presenter Component */
const ResetPasswordTemplatePresenter: React.VFC<PresenterProps> = ({ token, tokenErrors, mutation, ...props }) => (
  <HtmlSkeleton {...props}>
    <Title>Reset Password</Title>
    <Flex {...styles.container} {...props}>
      <Stack {...styles.contents}>
        <Heading {...styles.head}>Enter new password</Heading>
        <ResetPasswordForm {...{ token, tokenErrors, mutation }} />
      </Stack>
    </Flex>
  </HtmlSkeleton>
)

/** Container Component */
const ResetPasswordTemplateContainer: React.VFC<ContainerProps<ResetPasswordTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** ResetPasswordTemplate */
export default connect<ResetPasswordTemplateProps, PresenterProps>(
  'ResetPasswordTemplate',
  ResetPasswordTemplatePresenter,
  ResetPasswordTemplateContainer
)
