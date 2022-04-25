import Layout, { Title } from 'components/05_layouts/Layout'
import { connect } from 'components/hoc'
import {
  BlockContactMutation,
  BlockContactMutationVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  ContactApplicationMutation,
  ContactApplicationMutationVariables,
  ContactApprovalMutation,
  ContactApprovalMutationVariables,
  ContactInfoQuery,
  ContactsQuery,
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  DeleteContactMutation,
  DeleteContactMutationVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  EditProfileMutation,
  EditProfileMutationVariables,
  LatestMessagesQuery,
  MeQuery,
  ReadMessagesMutation,
  ReadMessagesMutationVariables,
  SearchUserQuery,
  SearchUserQueryVariables,
  SendMessageMutation,
  SendMessageMutationVariables,
  SignOutMutation,
  SignOutMutationVariables,
  UnblockContactMutation,
  UnblockContactMutationVariables,
  UndeleteContactMutation,
  UndeleteContactMutationVariables
} from 'graphql/generated'
import React from 'react'
import {
  ContainerProps,
  LazyQueryFunction,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  QueryRefetch,
  ValidationErrors
} from 'types'

/** IndexTemplate Props */
export type IndexTemplateProps = {
  /**
   * Query
   */
  query: {
    /**
     * サインインユーザー情報
     */
    me?: MeQuery['me']
    /**
     * コンタクト一覧
     */
    contacts?: ContactsQuery['contacts']
    /**
     * メッセージ一覧
     */
    latestMessages?: LatestMessagesQuery['latestMessages']
    /**
     *  コンタクト情報
     */
    contactInfo: {
      contactInfo?: ContactInfoQuery['contactInfo']
      loading: QueryLoading
      networkStatus: QueryNetworkStatus
      refetch: QueryRefetch
      fetchMore: QueryFetchMore
    }
    /**
     * ユーザー検索
     */
    searchUser: {
      users?: SearchUserQuery['searchUser']
      loading: QueryLoading
      getUsersByCode: LazyQueryFunction<SearchUserQuery, SearchUserQueryVariables>
    }
  }
  /**
   * Mutation
   */
  mutation: {
    /**
     * サインアウト
     */
    signOut: {
      loading: MutaionLoading
      signOut: MutateFunction<SignOutMutation, SignOutMutationVariables>
    }
    /**
     * プロフィール編集
     */
    editProfile: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      editProfile: MutateFunction<EditProfileMutation, EditProfileMutationVariables>
    }
    /**
     * パスワード変更
     */
    changePassword: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      changePassword: MutateFunction<ChangePasswordMutation, ChangePasswordMutationVariables>
    }
    /**
     * アカウント削除
     */
    deleteAccount: {
      loading: MutaionLoading
      deleteAccount: MutateFunction<DeleteAccountMutation, DeleteAccountMutationVariables>
    }
    /**
     * メッセージ送信
     */
    sendMessage: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      sendMessage: MutateFunction<SendMessageMutation, SendMessageMutationVariables>
    }
    /**
     * メッセージ削除
     */
    deleteMessage: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      deleteMessage: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
    /**
     * メッセージ既読
     */
    readMessages: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      readMessages: MutateFunction<ReadMessagesMutation, ReadMessagesMutationVariables>
    }
    /**
     * コンタクト申請
     */
    contactApplication: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      contactApplication: MutateFunction<
        ContactApplicationMutation,
        ContactApplicationMutationVariables
      >
    }
    /**
     * コンタクト承認
     */
    contactApproval: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      contactApproval: MutateFunction<ContactApprovalMutation, ContactApprovalMutationVariables>
    }
    /**
     * コンタクト削除
     */
    deleteContact: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      deleteContact: MutateFunction<DeleteContactMutation, DeleteContactMutationVariables>
    }
    /**
     * コンタクト削除取消
     */
    undeleteContact: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      undeleteContact: MutateFunction<UndeleteContactMutation, UndeleteContactMutationVariables>
    }
    /**
     * コンタクトブロック
     */
    blockContact: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      blockContact: MutateFunction<BlockContactMutation, BlockContactMutationVariables>
    }
    /**
     * コンタクトブロック解除
     */
    unblockContact: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      unblockContact: MutateFunction<UnblockContactMutation, UnblockContactMutationVariables>
    }
  }
}
/** Presenter Props */
type PresenterProps = IndexTemplateProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Layout>
    <Title>Home</Title>
    こんにちは, {props.query.me?.name}
  </Layout>
)

/** Container Component */
const Container: React.VFC<ContainerProps<IndexTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** IndexTemplate */
export default connect<IndexTemplateProps, PresenterProps>('IndexTemplate', Presenter, Container)
