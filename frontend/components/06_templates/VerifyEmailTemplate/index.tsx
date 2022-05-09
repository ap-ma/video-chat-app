import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import { VerifyEmailMutation } from 'graphql/generated'
import React, { ReactNode } from 'react'
import { ContainerProps } from 'types'
import Failure from './Failure'
import Success from './Success'

/** VerifyEmailTemplate Props */
export type VerifyEmailTemplateProps = Omit<HtmlSkeletonProps, 'children'> &
  Partial<{
    /**
     * メール検証結果
     */
    result: VerifyEmailMutation['verifyEmail']
  }>

/** Presenter Props */
type PresenterProps = Omit<VerifyEmailTemplateProps, 'result'> & { contents: ReactNode }

/** Presenter Component */
const VerifyEmailTemplatePresenter: React.VFC<PresenterProps> = ({ contents, ...props }) => (
  <HtmlSkeleton {...props}>
    <Title>Verify Email</Title>
    {contents}
  </HtmlSkeleton>
)

/** Container Component */
const VerifyEmailTemplateContainer: React.VFC<ContainerProps<VerifyEmailTemplateProps, PresenterProps>> = ({
  presenter,
  result,
  ...props
}) => {
  const contents: PresenterProps['contents'] = result ? <Success /> : <Failure />
  return presenter({ contents, ...props })
}

/** VerifyEmailTemplate */
export default connect<VerifyEmailTemplateProps, PresenterProps>(
  'VerifyEmailTemplate',
  VerifyEmailTemplatePresenter,
  VerifyEmailTemplateContainer
)
