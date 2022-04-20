import { QueryResult, QueryTuple } from '@apollo/client/'
import Layout, { Title } from 'components/05_layouts/Layout'
import { connect } from 'components/hoc'
import {
  ChatHistoryQuery,
  ContactInfoQuery,
  ContactListQuery,
  MeQuery,
  SearchUserQuery,
  SearchUserQueryVariables
} from 'graphql/generated'
import React from 'react'
import { ContainerProps } from 'types'

/** IndexTemplate Props */
export type IndexTemplateProps = {
  // ここの型定義は後で下位コンポーネントに移動

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
    loading: QueryResult['loading']
    networkStatus: QueryResult['networkStatus']
    refetch: QueryResult['refetch']
    fetchMore: QueryResult['fetchMore']
  }
  /**
   * ユーザー検索
   */
  searchUser: {
    users?: SearchUserQuery['searchUser']
    loading: QueryResult['loading']
    getUsersByCode: QueryTuple<SearchUserQuery, SearchUserQueryVariables>[0]
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
