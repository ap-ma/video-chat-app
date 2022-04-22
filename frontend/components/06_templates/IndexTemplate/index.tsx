import Layout, { Title } from 'components/05_layouts/Layout'
import { connect } from 'components/hoc'
import {
  ChatHistoryQuery,
  ContactInfoQuery,
  ContactListQuery,
  EditProfileMutation,
  EditProfileMutationVariables,
  MeQuery,
  SearchUserQuery,
  SearchUserQueryVariables,
  SignOutMutation,
  SignOutMutationVariables
} from 'graphql/generated'
import React from 'react'
import {
  ContainerProps,
  LazyQueryFunction,
  MutaionLoading,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  QueryRefetch,
  ValidationErrors
} from 'types'

/** IndexTemplate Props */
export type IndexTemplateProps = {
  // ここの型定義は後で下位コンポーネントに移動

  //  ----------------------------------------------------------------------------
  //  Query
  //  ----------------------------------------------------------------------------

  /**
   * サインインユーザー情報
   */
  me?: MeQuery['me']
  /**
   * コンタクト一覧
   */
  contactList?: ContactListQuery['contactList']
  /**
   * チャット履歴
   */
  chatHistroy?: ChatHistoryQuery['chatHistory']
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

  //  ----------------------------------------------------------------------------
  //  Mutation
  //  ----------------------------------------------------------------------------

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
    editProfile: MutateFunction<EditProfileMutation, EditProfileMutationVariables>
  }
}
/** Presenter Props */
type PresenterProps = IndexTemplateProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Layout>
    <Title>Home</Title>
    こんにちは, {props.me?.name}
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
