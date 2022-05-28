import { useApolloClient } from '@apollo/client'
import { ApolloError, GraphQLErrors } from '@apollo/client/errors'
import toast from 'components/01_atoms/Toast'
import IndexTemplate, { IndexTemplateProps } from 'components/06_templates/IndexTemplate'
import { CHAT_LENGTH, ERROR_PAGE, SIGNIN_PAGE } from 'const'
import { addApolloState, initializeApollo } from 'graphql/apollo'
import {
  InitDocument,
  InitQuery,
  InitQueryVariables,
  useApplyContactMutation,
  useApproveContactMutation,
  useBlockContactMutation,
  useChangeEmailMutation,
  useChangePasswordMutation,
  useContactInfoLazyQuery,
  useContactInfoQuery,
  useContactsQuery,
  useDeleteAccountMutation,
  useDeleteContactMutation,
  useDeleteMessageMutation,
  useEditProfileMutation,
  useLatestMessagesQuery,
  useMeQuery,
  useMessageSubscription,
  useReadMessagesMutation,
  useSearchUserLazyQuery,
  useSendImageMutation,
  useSendMessageMutation,
  useSignOutMutation,
  useUnblockContactMutation,
  useUndeleteContactMutation
} from 'graphql/generated'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { isNode, isNullish } from 'utils'
import {
  handle,
  Handler,
  isApproveContact,
  isValidationErrors,
  updateContactCache,
  updateMessageCache
} from 'utils/apollo'
import { contactInfoUserIdVar, setContactInfoUserId } from 'utils/apollo/state'
import { toStr } from 'utils/general/helper'

const Index: NextPage = () => {
  const router = useRouter()

  // Apollo Client
  const apolloClient = useApolloClient()

  // Redirect
  const toSigninPage = () => router.replace(SIGNIN_PAGE)
  const toErrorPage = () => router.replace(ERROR_PAGE)
  const destroy = () => {
    apolloClient.clearStore()
    toSigninPage()
  }

  // Operation Handler
  const handler: Handler<Promise<boolean> | GraphQLErrors | undefined> = {
    noError: () => undefined,
    authenticationError: () => toSigninPage(),
    validationError: (errors) => errors,
    _default: () => toErrorPage()
  }

  //  ----------------------------------------------------------------------------
  //  Local State
  //  ----------------------------------------------------------------------------
  const contactInfoUserId = contactInfoUserIdVar()

  //  ----------------------------------------------------------------------------
  //  Query
  //  ----------------------------------------------------------------------------

  // ユーザー情報
  const meQuery = useMeQuery({ fetchPolicy: 'cache-first' })
  handle(meQuery.error, handler)
  if (isNullish(contactInfoUserId)) {
    setContactInfoUserId(toStr(meQuery.data?.me.id))
  }

  // コンタクト一覧
  const contactsQuery = useContactsQuery({ fetchPolicy: 'cache-first' })
  handle(contactsQuery.error, handler)

  // メッセージ一覧
  const latestMessagesQuery = useLatestMessagesQuery()
  handle(latestMessagesQuery.error, handler)

  // コンタクト情報
  const contactInfoQuery = useContactInfoQuery({
    variables: { contactUserId: contactInfoUserId, limit: CHAT_LENGTH }
  })
  handle(contactInfoQuery.error, handler)

  // コンタクト情報 Lazy
  const [contactInfo, contactInfoLazyQuery] = useContactInfoLazyQuery({ fetchPolicy: 'network-only' })
  handle(contactInfoLazyQuery.error, handler)

  // ユーザー検索
  const [searchUser, searchUserLazyQuery] = useSearchUserLazyQuery({ fetchPolicy: 'network-only' })
  handle(searchUserLazyQuery.error, handler)

  //  ----------------------------------------------------------------------------
  //  Mutation
  //  ----------------------------------------------------------------------------

  // サインアウト
  const [signOut, signOutMutation] = useSignOutMutation()
  handle(signOutMutation.error, handler)
  if (signOutMutation.data?.signOut) destroy()

  // プロフィール編集
  const [editProfile, editProfileMutation] = useEditProfileMutation({
    onCompleted: () => {
      contactInfo()
      toast('EditProfileComplete')()
    }
  })
  const editProfileResult = handle(editProfileMutation.error, handler)

  // メールアドレス変更
  const [changeEmail, changeEmailMutation] = useChangeEmailMutation()
  const changeEmailResult = handle(changeEmailMutation.error, handler)

  // パスワード変更
  const [changePassword, changePasswordMutation] = useChangePasswordMutation()
  const changePasswordResult = handle(changePasswordMutation.error, handler)

  // アカウント削除
  const [deleteAccount, deleteAccountMutation] = useDeleteAccountMutation()
  handle(deleteAccountMutation.error, handler)
  if (deleteAccountMutation.data?.deleteAccount) destroy()

  // メッセージ送信
  const [sendMessage, sendMessageMutation] = useSendMessageMutation({
    update: (cache, { data }) => !isNullish(data) && updateMessageCache(cache, data.sendMessage)
  })
  const sendMessageResult = handle(sendMessageMutation.error, handler)

  // 画像送信
  const [sendImage, sendImageMutation] = useSendImageMutation({
    update: (cache, { data }) => !isNullish(data) && updateMessageCache(cache, data.sendImage)
  })
  const sendImageResult = handle(sendImageMutation.error, handler)

  // メッセージ削除
  const [deleteMessage, deleteMessageMutation] = useDeleteMessageMutation({
    update: (cache, { data }) => !isNullish(data) && updateMessageCache(cache, data.deleteMessage)
  })
  const deleteMessageResult = handle(deleteMessageMutation.error, handler)

  // メッセージ既読
  const [readMessages, readMessagesMutation] = useReadMessagesMutation()
  const readMessagesResult = handle(readMessagesMutation.error, handler)

  // コンタクト申請
  const [applyContact, applyContactMutation] = useApplyContactMutation({
    update: (cache, { data }) => !isNullish(data) && updateMessageCache(cache, data.applyContact)
  })
  const applyContactResult = handle(applyContactMutation.error, handler)

  // コンタクト承認
  const [approveContact, approveContactMutation] = useApproveContactMutation({
    update: (cache, { data }) => !isNullish(data) && updateMessageCache(cache, data.approveContact),
    onCompleted: () => contactsQuery.refetch()
  })
  const approveContactResult = handle(approveContactMutation.error, handler)

  // コンタクト削除
  const [deleteContact, deleteContactMutation] = useDeleteContactMutation({
    update: (cache, { data }) => !isNullish(data) && updateContactCache(cache, data.deleteContact, 'DELETE')
  })
  const deleteContactResult = handle(deleteContactMutation.error, handler)

  // コンタクト削除取消
  const [undeleteContact, undeleteContactMutation] = useUndeleteContactMutation({
    update: (cache, { data }) => !isNullish(data) && updateContactCache(cache, data.undeleteContact, 'ADD')
  })
  const undeleteContactResult = handle(undeleteContactMutation.error, handler)

  // コンタクトブロック
  const [blockContact, blockContactMutation] = useBlockContactMutation({
    update: (cache, { data }) => !isNullish(data) && updateContactCache(cache, data.blockContact, 'DELETE')
  })
  const blockContactResult = handle(blockContactMutation.error, handler)

  // コンタクトブロック解除
  const [unblockContact, unblockContactMutation] = useUnblockContactMutation({
    update: (cache, { data }) => !isNullish(data) && updateContactCache(cache, data.unblockContact, 'ADD'),
    onCompleted: ({ unblockContact }) => {
      if (contactInfoUserId === unblockContact.userId) {
        readMessages({ variables: { otherUserId: unblockContact.userId } }).catch(toast('ValidationError'))
      }
    }
  })
  const unblockContactResult = handle(unblockContactMutation.error, handler)

  //  ----------------------------------------------------------------------------
  //  Subscription
  //  ----------------------------------------------------------------------------

  // メッセージ購読
  const messageSubscription = useMessageSubscription({
    skip: isNode(),
    onSubscriptionData: ({ client, subscriptionData: { data } }) => {
      if (isNullish(data)) return
      const messageChanged = data.messageSubscription
      updateMessageCache(client.cache, messageChanged)
      if (isApproveContact(messageChanged)) contactsQuery.refetch()
      if (contactInfoUserId === messageChanged.txUserId) {
        readMessages({ variables: { otherUserId: messageChanged.txUserId } }).catch(toast('ValidationError'))
      }
    }
  })
  handle(messageSubscription.error, handler)

  //  ----------------------------------------------------------------------------

  // IndexTemplate Props
  const props: IndexTemplateProps = {
    state: {
      contactInfoUserId: {
        state: contactInfoUserId,
        setContactInfoUserId
      }
    },
    query: {
      me: {
        result: meQuery.data?.me,
        ...meQuery
      },
      contacts: {
        result: contactsQuery.data?.contacts,
        ...contactsQuery
      },
      latestMessages: {
        result: latestMessagesQuery.data?.latestMessages,
        ...latestMessagesQuery
      },
      contactInfo: {
        result: contactInfoQuery.data?.contactInfo,
        ...contactInfoQuery
      },
      searchUser: {
        result: searchUserLazyQuery.data?.searchUser,
        loading: searchUserLazyQuery.loading,
        query: searchUser
      }
    },
    mutation: {
      signOut: {
        loading: signOutMutation.loading,
        mutate: signOut
      },
      editProfile: {
        result: editProfileMutation.data?.editProfile,
        loading: editProfileMutation.loading,
        errors: isValidationErrors(editProfileResult) ? editProfileResult : undefined,
        reset: editProfileMutation.reset,
        mutate: editProfile
      },
      changeEmail: {
        result: changeEmailMutation.data?.changeEmail,
        loading: changeEmailMutation.loading,
        errors: isValidationErrors(changeEmailResult) ? changeEmailResult : undefined,
        reset: changeEmailMutation.reset,
        mutate: changeEmail
      },
      changePassword: {
        result: changePasswordMutation.data?.changePassword,
        loading: changePasswordMutation.loading,
        errors: isValidationErrors(changePasswordResult) ? changePasswordResult : undefined,
        reset: changePasswordMutation.reset,
        mutate: changePassword
      },
      deleteAccount: {
        result: deleteAccountMutation.data?.deleteAccount,
        loading: deleteAccountMutation.loading,
        mutate: deleteAccount
      },
      sendMessage: {
        loading: sendMessageMutation.loading,
        errors: isValidationErrors(sendMessageResult) ? sendMessageResult : undefined,
        reset: sendMessageMutation.reset,
        mutate: sendMessage
      },
      sendImage: {
        loading: sendImageMutation.loading,
        errors: isValidationErrors(sendImageResult) ? sendImageResult : undefined,
        reset: sendImageMutation.reset,
        mutate: sendImage
      },
      deleteMessage: {
        loading: deleteMessageMutation.loading,
        errors: isValidationErrors(deleteMessageResult) ? deleteMessageResult : undefined,
        reset: deleteMessageMutation.reset,
        mutate: deleteMessage
      },
      readMessages: {
        loading: readMessagesMutation.loading,
        errors: isValidationErrors(readMessagesResult) ? readMessagesResult : undefined,
        reset: readMessagesMutation.reset,
        mutate: readMessages
      },
      applyContact: {
        result: applyContactMutation.data?.applyContact,
        loading: applyContactMutation.loading,
        errors: isValidationErrors(applyContactResult) ? applyContactResult : undefined,
        reset: applyContactMutation.reset,
        mutate: applyContact
      },
      approveContact: {
        result: approveContactMutation.data?.approveContact,
        loading: approveContactMutation.loading,
        errors: isValidationErrors(approveContactResult) ? approveContactResult : undefined,
        reset: approveContactMutation.reset,
        mutate: approveContact
      },
      deleteContact: {
        result: deleteContactMutation.data?.deleteContact,
        loading: deleteContactMutation.loading,
        errors: isValidationErrors(deleteContactResult) ? deleteContactResult : undefined,
        reset: deleteContactMutation.reset,
        mutate: deleteContact
      },
      undeleteContact: {
        result: undeleteContactMutation.data?.undeleteContact,
        loading: undeleteContactMutation.loading,
        errors: isValidationErrors(undeleteContactResult) ? undeleteContactResult : undefined,
        reset: undeleteContactMutation.reset,
        mutate: undeleteContact
      },
      blockContact: {
        result: blockContactMutation.data?.blockContact,
        loading: blockContactMutation.loading,
        errors: isValidationErrors(blockContactResult) ? blockContactResult : undefined,
        reset: blockContactMutation.reset,
        mutate: blockContact
      },
      unblockContact: {
        result: unblockContactMutation.data?.unblockContact,
        loading: unblockContactMutation.loading,
        errors: isValidationErrors(unblockContactResult) ? unblockContactResult : undefined,
        reset: unblockContactMutation.reset,
        mutate: unblockContact
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
 * SSR, CSR問わずこの関数にて作成されたキャッシュが参照可能となる
 * CSRにおいて、頻繁に更新されることのないデータのqueryについてはこちらでキャッシュを作成し、
 * useQueryのFetchPoliciesをcache-first|cache-onlyとすることで不要なAPIアクセスを削減できる
 *
 * @param context
 * @returns
 */
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const apolloClient = initializeApollo()
  const cookie = req.headers.cookie
  const context = { headers: { cookie } }

  const { error } = await apolloClient
    .query<InitQuery, InitQueryVariables>({
      context,
      query: InitDocument,
      variables: { limit: CHAT_LENGTH }
    })
    .catch((error) => ({ error: error as ApolloError }))

  return handle(error, {
    noError: () => addApolloState(apolloClient, { props: {} }),
    authenticationError: () => ({ redirect: { permanent: false, destination: SIGNIN_PAGE } }),
    _default: () => ({ redirect: { permanent: false, destination: ERROR_PAGE } })
  })
}

export default Index
