import { ApolloError } from '@apollo/client/errors'
import IndexTemplate, { IndexTemplateProps } from 'components/06_templates/IndexTemplate'
import { CHAT_LENGTH, ERROR_PAGE, SIGNIN_PAGE } from 'const'
import { addApolloState, initializeApollo } from 'graphql/apollo'
import {
  InitDocument,
  InitQuery,
  InitQueryVariables,
  useChatHistoryQuery,
  useContactInfoQuery,
  useContactListQuery,
  useMeQuery,
  useSearchUserLazyQuery
} from 'graphql/generated'
import { handle } from 'graphql/lib'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

const Index: NextPage = () => {
  const router = useRouter()

  // リダイレクト
  const toSigninPage = () => router.replace(SIGNIN_PAGE)
  const toErrorPage = () => router.replace(ERROR_PAGE)

  // エラーハンドリング
  const resolver: Parameters<typeof handle>[1] = {
    internalServerError: () => toErrorPage(),
    authenticationError: () => toSigninPage(),
    networkError: () => toErrorPage(),
    validationError: (errors) => Promise.resolve(errors),
    _default: () => Promise.resolve(undefined)
  }

  // ユーザー情報
  const meQuery = useMeQuery({ fetchPolicy: 'cache-only' })
  handle(meQuery.error, resolver)

  // コンタクト一覧
  const contactListQuery = useContactListQuery({ fetchPolicy: 'cache-only' })
  handle(contactListQuery.error, resolver)

  // チャット履歴
  const chatHistoryQuery = useChatHistoryQuery()
  handle(chatHistoryQuery.error, resolver)

  // コンタクト情報
  const contactInfoQuery = useContactInfoQuery({
    variables: { limit: CHAT_LENGTH },
    notifyOnNetworkStatusChange: true
  })
  handle(contactInfoQuery.error, resolver)

  // ユーザー検索
  const [getUsersByCode, searchUserQuery] = useSearchUserLazyQuery({ fetchPolicy: 'network-only' })
  handle(searchUserQuery.error, resolver)

  const props: IndexTemplateProps = {
    me: meQuery.data?.me,
    contactList: contactListQuery.data?.contactList,
    chatHistroy: chatHistoryQuery.data?.chatHistory,
    contactInfo: { contactInfo: contactInfoQuery.data?.contactInfo, ...contactInfoQuery },
    searchUser: {
      users: searchUserQuery.data?.searchUser,
      loading: searchUserQuery.loading,
      getUsersByCode
    }
  }

  return <IndexTemplate {...props} />
}

/**
 * SSR時のみ実行され、ページのレンダリングに使用されるpropsを含むオブジェクトを返す
 *
 * SSR時のみAPIアクセスを行うクエリを実行し、キャッシュを作成する
 * 各コンポーネントにてuseQueryを用いて対象となるqueryが実行される場合、
 * SSR, CSR問わずこの関数にて作成されたキャッシュを参照することができる
 * CSRにおいて、頻繁に更新されることのないデータのqueryについてはこちらでキャッシュを作成し、
 * useQueryのFetchPoliciesをcache-first|cache-onlyとすることで不要なAPIアクセスを削減できる
 *
 * @param context
 * @returns
 */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo()
  const cookie = ctx.req.headers.cookie
  const context = { headers: { cookie } }

  const { error } = await apolloClient
    .query<InitQuery, InitQueryVariables>({
      query: InitDocument,
      variables: { limit: CHAT_LENGTH },
      context
    })
    .catch((error) => ({ error: error as ApolloError }))

  return handle(error, {
    noError: () => addApolloState(apolloClient, { props: {} }),
    authenticationError: () => ({ redirect: { permanent: false, destination: SIGNIN_PAGE } }),
    _default: () => ({ redirect: { permanent: false, destination: ERROR_PAGE } })
  })
}

export default Index
