import { ApolloError, GraphQLErrors } from '@apollo/client/errors'
import SigninTemplate, { SigninTemplateProps } from 'components/06_templates/SigninTemplate'
import { ERROR_PAGE, INDEX_PAGE } from 'const'
import { initializeApollo } from 'graphql/apollo'
import {
  IsAuthenticatedDocument,
  IsAuthenticatedQuery,
  IsAuthenticatedQueryVariables,
  useForgotPasswordMutation,
  useSignInMutation,
  useSignUpMutation
} from 'graphql/generated'
import { NextPage } from 'next'
import { default as Router, useRouter } from 'next/router'
import React from 'react'
import { isBrowser, isNode, isNullish } from 'utils'
import { handle, Handler, isValidationErrors } from 'utils/apollo'

const Signin: NextPage = () => {
  const router = useRouter()

  // Redirect
  const toIndexPage = () => router.replace(INDEX_PAGE)
  const toErrorPage = () => router.replace(ERROR_PAGE)

  // Operation Handler
  const handler: Handler<Promise<boolean> | GraphQLErrors | undefined> = {
    noError: () => undefined,
    validationError: (errors) => errors,
    _default: () => toErrorPage()
  }

  // サインイン
  const [signIn, signInMutation] = useSignInMutation()
  const signInResult = handle(signInMutation.error, handler)
  if (signInMutation.data?.signIn) toIndexPage()

  // サインアップ
  const [signUp, signUpMutation] = useSignUpMutation()
  const signUpResult = handle(signUpMutation.error, handler)

  // パスワード忘れ
  const [forgotPassword, forgotPasswordMutation] = useForgotPasswordMutation()
  const forgotPasswordResult = handle(forgotPasswordMutation.error, handler)

  // SigninTemplate Props
  const props: SigninTemplateProps = {
    mutation: {
      signIn: {
        result: signInMutation.data?.signIn,
        loading: signInMutation.loading,
        errors: isValidationErrors(signInResult) ? signInResult : undefined,
        reset: signInMutation.reset,
        mutate: signIn
      },
      signUp: {
        result: signUpMutation.data?.signUp,
        loading: signUpMutation.loading,
        errors: isValidationErrors(signUpResult) ? signUpResult : undefined,
        reset: signUpMutation.reset,
        mutate: signUp
      },
      forgotPassword: {
        result: forgotPasswordMutation.data?.forgotPassword,
        loading: forgotPasswordMutation.loading,
        errors: isValidationErrors(forgotPasswordResult) ? forgotPasswordResult : undefined,
        reset: forgotPasswordMutation.reset,
        mutate: forgotPassword
      }
    }
  }

  return <SigninTemplate {...props} />
}

/**
 * 初期ロードではサーバー上のみで実行され、
 * next/link, next/routerを使用してページ遷移する際はクライアント上で実行される
 *
 * リダイレクト等の処理を適切な環境で実行できるため、
 * 常にgetServerSidePropsを用いて処理を行うよりパフォーマンスに優れる
 *
 * @param param0
 * @returns
 */
Signin.getInitialProps = async ({ req, res }) => {
  const apolloClient = initializeApollo()
  const context: Record<string, unknown> = {}

  if (isNode()) {
    const cookie = req?.headers.cookie
    context['headers'] = { cookie }
  }

  const { data, error } = await apolloClient
    .query<IsAuthenticatedQuery, IsAuthenticatedQueryVariables>({
      context,
      query: IsAuthenticatedDocument
    })
    .catch((error) => ({ data: undefined, error: error as ApolloError }))

  if (data?.isAuthenticated || !isNullish(error)) {
    const page = handle(error, {
      noError: () => INDEX_PAGE,
      _default: () => ERROR_PAGE
    })

    if (isNode()) {
      res?.writeHead(307, { Location: page }).end()
    }

    if (isBrowser()) {
      Router.push(page)
    }
  }

  // 空データを返すと警告が出る
  return { __dummy: undefined }
}

export default Signin
