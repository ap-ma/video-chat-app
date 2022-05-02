import Layout, { Title } from 'components/05_layouts/Layout'
import { connect } from 'components/hoc'
import { INDEX_PAGE } from 'const'
import { VerifyEmailMutation } from 'graphql/generated'
import Link from 'next/link'
import React from 'react'
import { ContainerProps, ValidationErrors } from 'types'

/** VerifyEmailTemplate Props */
export type VerifyEmailTemplateProps = Partial<{
  /**
   * メール検証結果
   */
  result: VerifyEmailMutation['verifyEmail']
  /**
   * メール検証エラー
   */
  errors: ValidationErrors
}>
/** Presenter Props */
type PresenterProps = VerifyEmailTemplateProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ result, errors }) => (
  <Layout>
    <Title>Verify Email</Title>
    Eメール検証
    {errors?.map((e, i) => (
      <div key={i}>{e.message}</div>
    ))}
    {result && (
      <div>
        メール検証完了した。以下リンクでトップページへ
        <Link href={INDEX_PAGE}>
          <a>Home</a>
        </Link>
      </div>
    )}
  </Layout>
)

/** Container Component */
const Container: React.VFC<ContainerProps<VerifyEmailTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** VerifyEmailTemplate */
export default connect<VerifyEmailTemplateProps, PresenterProps>(
  'VerifyEmailTemplate',
  Presenter,
  Container
)
