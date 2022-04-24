import { ApolloError, GraphQLErrors } from '@apollo/client/errors'
import IndexTemplate, { IndexTemplateProps } from 'components/06_templates/IndexTemplate'
import { CHAT_LENGTH, ERROR_PAGE, SIGNIN_PAGE } from 'const'
import { addApolloState, initializeApollo } from 'graphql/apollo'
import {
  ContactListDocument,
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
  useReadMessagesMutation,
  useSearchUserLazyQuery,
  useSendMessageMutation,
  useSignOutMutation,
  useUnblockContactMutation,
  useUndeleteContactMutation
} from 'graphql/generated'
import { handle, Handler, isValidationErrors, updateChatCache } from 'graphql/lib'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { isNullish } from 'utils'

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
  if (signOutMutation.data?.signOut) {
    signOutMutation.client.clearStore()
    toSigninPage()
  }

  // プロフィール編集
  const [editProfile, editProfileMutation] = useEditProfileMutation()
  const editProfileResult = handle(editProfileMutation.error, handler)

  // パスワード変更
  const [changePassword, changePasswordMutation] = useChangePasswordMutation()
  const changePasswordResult = handle(changePasswordMutation.error, handler)

  // アカウント削除
  const [deleteAccount, deleteAccountMutation] = useDeleteAccountMutation()
  handle(deleteAccountMutation.error, handler)
  if (deleteAccountMutation.data?.deleteAccount) toSigninPage()

  // メッセージ送信
  const [sendMessage, sendMessageMutation] = useSendMessageMutation({
    update(cache, { data }) {
      if (!isNullish(data)) updateChatCache(cache, data.sendMessage)
    }
  })
  const sendMessageResult = handle(sendMessageMutation.error, handler)

  // メッセージ削除
  const [deleteMessage, deleteMessageMutation] = useDeleteMessageMutation({
    update(cache, { data }) {
      if (!isNullish(data)) updateChatCache(cache, data.deleteMessage)
    }
  })
  const deleteMessageResult = handle(deleteMessageMutation.error, handler)

  // メッセージ既読
  const [readMessages, readMessagesMutation] = useReadMessagesMutation()
  const readMessagesResult = handle(readMessagesMutation.error, handler)

  // コンタクト申請
  const [contactApplication, contactApplicationMutation] = useContactApplicationMutation({
    update(cache, { data }) {
      if (!isNullish(data)) updateChatCache(cache, data.contactApplication)
    }
  })
  const contactApplicationResult = handle(contactApplicationMutation.error, handler)

  // コンタクト承認
  const [contactApproval, contactApprovalMutation] = useContactApprovalMutation({
    update(cache, { data }) {
      if (!isNullish(data)) updateChatCache(cache, data.contactApproval)
    },
    refetchQueries: [ContactListDocument]
  })
  const contactApprovalResult = handle(contactApprovalMutation.error, handler)

  // コンタクト削除
  const [deleteContact, deleteContactMutation] = useDeleteContactMutation()
  const deleteContactResult = handle(deleteContactMutation.error, handler)

  // コンタクト削除取消
  const [undeleteContact, undeleteContactMutation] = useUndeleteContactMutation()
  const undeleteContactResult = handle(undeleteContactMutation.error, handler)

  // コンタクトブロック
  const [blockContact, blockContactMutation] = useBlockContactMutation()
  const blockContactResult = handle(blockContactMutation.error, handler)

  // コンタクトブロック解除
  const [unblockContact, unblockContactMutation] = useUnblockContactMutation()
  const unblockContactResult = handle(unblockContactMutation.error, handler)

  // IndexTemplate Props
  const props: IndexTemplateProps = {
    query: {
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
      }
    },
    mutation: {
      signOut: {
        loading: signOutMutation.loading,
        signOut
      },
      editProfile: {
        loading: editProfileMutation.loading,
        errors: isValidationErrors(editProfileResult) ? editProfileResult : undefined,
        reset: editProfileMutation.reset,
        editProfile
      },
      changePassword: {
        loading: changePasswordMutation.loading,
        errors: isValidationErrors(changePasswordResult) ? changePasswordResult : undefined,
        reset: changePasswordMutation.reset,
        changePassword
      },
      deleteAccount: {
        loading: deleteAccountMutation.loading,
        deleteAccount
      },
      sendMessage: {
        loading: sendMessageMutation.loading,
        errors: isValidationErrors(sendMessageResult) ? sendMessageResult : undefined,
        reset: sendMessageMutation.reset,
        sendMessage
      },
      deleteMessage: {
        loading: deleteMessageMutation.loading,
        errors: isValidationErrors(deleteMessageResult) ? deleteMessageResult : undefined,
        reset: deleteMessageMutation.reset,
        deleteMessage
      },
      readMessages: {
        loading: readMessagesMutation.loading,
        errors: isValidationErrors(readMessagesResult) ? readMessagesResult : undefined,
        reset: readMessagesMutation.reset,
        readMessages
      },
      contactApplication: {
        loading: contactApplicationMutation.loading,
        errors: isValidationErrors(contactApplicationResult) ? contactApplicationResult : undefined,
        reset: contactApplicationMutation.reset,
        contactApplication
      },
      contactApproval: {
        loading: contactApprovalMutation.loading,
        errors: isValidationErrors(contactApprovalResult) ? contactApprovalResult : undefined,
        reset: contactApprovalMutation.reset,
        contactApproval
      },
      deleteContact: {
        loading: deleteContactMutation.loading,
        errors: isValidationErrors(deleteContactResult) ? deleteContactResult : undefined,
        reset: deleteContactMutation.reset,
        deleteContact
      },
      undeleteContact: {
        loading: undeleteContactMutation.loading,
        errors: isValidationErrors(undeleteContactResult) ? undeleteContactResult : undefined,
        reset: undeleteContactMutation.reset,
        undeleteContact
      },
      blockContact: {
        loading: blockContactMutation.loading,
        errors: isValidationErrors(blockContactResult) ? blockContactResult : undefined,
        reset: blockContactMutation.reset,
        blockContact
      },
      unblockContact: {
        loading: unblockContactMutation.loading,
        errors: isValidationErrors(unblockContactResult) ? unblockContactResult : undefined,
        reset: unblockContactMutation.reset,
        unblockContact
      }
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
