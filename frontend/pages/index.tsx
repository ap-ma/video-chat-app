import { ApolloError, GraphQLErrors } from '@apollo/client/errors'
import IndexTemplate, { IndexTemplateProps } from 'components/06_templates/IndexTemplate'
import { CHAT_LENGTH, ERROR_PAGE, SIGNIN_PAGE } from 'const'
import { addApolloState, initializeApollo } from 'graphql/apollo'
import {
  InitDocument,
  InitQuery,
  InitQueryVariables,
  useBlockContactMutation,
  useChangePasswordMutation,
  useChatHistoryQuery,
  useContactApplicationMutation,
  useContactApprovalMutation,
  useContactInfoQuery,
  useContactListQuery,
  useDeleteAccountMutation,
  useDeleteContactMutation,
  useDeleteMessageMutation,
  useEditProfileMutation,
  useMeQuery,
  useReadMessageMutation,
  useSearchUserLazyQuery,
  useSendMessageMutation,
  useSignOutMutation,
  useUnblockContactMutation,
  useUndeleteContactMutation
} from 'graphql/generated'
import { handle, Handler, isValidationErrors } from 'graphql/lib'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

const Index: NextPage = () => {
  const router = useRouter()

  // Redirect
  const toSigninPage = () => router.replace(SIGNIN_PAGE)
  const toErrorPage = () => router.replace(ERROR_PAGE)

  // Operation Handler
  const handler: Handler<Promise<boolean> | GraphQLErrors | undefined> = {
    noError: () => undefined,
    authenticationError: () => toSigninPage(),
    validationError: (errors) => errors,
    _default: () => toErrorPage()
  }

  //  ----------------------------------------------------------------------------
  //  Query
  //  ----------------------------------------------------------------------------

  // ユーザー情報
  const meQuery = useMeQuery({ fetchPolicy: 'cache-only' })
  handle(meQuery.error, handler)

  // コンタクト一覧
  const contactListQuery = useContactListQuery({ fetchPolicy: 'cache-only' })
  handle(contactListQuery.error, handler)

  // チャット履歴
  const chatHistoryQuery = useChatHistoryQuery()
  handle(chatHistoryQuery.error, handler)

  // コンタクト情報
  const contactInfoQuery = useContactInfoQuery({
    variables: { limit: CHAT_LENGTH },
    notifyOnNetworkStatusChange: true
  })
  handle(contactInfoQuery.error, handler)

  // ユーザー検索
  const [getUsersByCode, searchUserQuery] = useSearchUserLazyQuery({ fetchPolicy: 'network-only' })
  handle(searchUserQuery.error, handler)

  //  ----------------------------------------------------------------------------
  //  Mutation
  //  ----------------------------------------------------------------------------

  // サインアウト
  const [signOut, signOutMutation] = useSignOutMutation()
  handle(signOutMutation.error, handler)

  // プロフィール編集
  const [editProfile, editProfileMutation] = useEditProfileMutation()
  const editProfileResult = handle(editProfileMutation.error, handler)

  // パスワード変更
  const [changePassword, changePasswordMutation] = useChangePasswordMutation()
  handle(changePasswordMutation.error, handler)

  // アカウント削除
  const [deleteAccount, deleteAccountMutation] = useDeleteAccountMutation()
  handle(deleteAccountMutation.error, handler)

  // メッセージ送信
  const [sendMessage, sendMessageMutation] = useSendMessageMutation()
  handle(sendMessageMutation.error, handler)

  // メッセージ削除
  const [deleteMessage, deleteMessageMutation] = useDeleteMessageMutation()
  handle(deleteMessageMutation.error, handler)

  // メッセージ既読
  const [readMessage, readMessageMutation] = useReadMessageMutation()
  handle(readMessageMutation.error, handler)

  // コンタクト申請
  const [contactApplication, contactApplicationMutation] = useContactApplicationMutation()
  handle(contactApplicationMutation.error, handler)

  // コンタクト承認
  const [contactApproval, contactApprovalMutation] = useContactApprovalMutation()
  handle(contactApprovalMutation.error, handler)

  // コンタクト削除
  const [deleteContact, deleteContactMutation] = useDeleteContactMutation()
  handle(deleteContactMutation.error, handler)

  // コンタクト削除取消
  const [undeleteContact, undeleteContactMutation] = useUndeleteContactMutation()
  handle(undeleteContactMutation.error, handler)

  // コンタクトブロック
  const [blockContact, blockContactMutation] = useBlockContactMutation()
  handle(blockContactMutation.error, handler)

  // コンタクトブロック解除
  const [unblockContact, unblockContactMutation] = useUnblockContactMutation()
  handle(unblockContactMutation.error, handler)

  // IndexTemplate Props
  const props: IndexTemplateProps = {
    // Query
    me: meQuery.data?.me,
    contactList: contactListQuery.data?.contactList,
    chatHistroy: chatHistoryQuery.data?.chatHistory,
    contactInfo: {
      contactInfo: contactInfoQuery.data?.contactInfo,
      ...contactInfoQuery
    },
    searchUser: {
      users: searchUserQuery.data?.searchUser,
      loading: searchUserQuery.loading,
      getUsersByCode
    },
    // Mutation
    signOut: {
      loading: signOutMutation.loading,
      signOut
    },
    editProfile: {
      loading: editProfileMutation.loading,
      errors: isValidationErrors(editProfileResult) ? editProfileResult : undefined,
      editProfile
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
