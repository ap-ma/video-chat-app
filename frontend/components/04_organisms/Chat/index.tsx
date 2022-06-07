import { Box, BoxProps } from '@chakra-ui/react'
import WorkflowCard from 'components/04_organisms/WorkflowCard'
import { connect } from 'components/hoc'
import {
  ContactInfoQuery,
  ContactInfoQueryVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables
} from 'graphql/generated'
import React from 'react'
import {
  ContainerProps,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  OnOpen,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  ValidationErrors
} from 'types'

/** Chat Props */
export type ChatProps = BoxProps & {
  /**
   * コンタクト申請ダイアログ onOpen
   */
  onApplyccdOpen: OnOpen
  /**
   * コンタクト承認ダイアログ onOpen
   */
  onApproveccdOpen: OnOpen
  /**
   * コンタクトブロック解除ダイアログ onOpen
   */
  onUbccdOpen: OnOpen
  /**
   * Query
   */
  query: {
    /**
     *  コンタクト情報
     */
    contactInfo: {
      result?: ContactInfoQuery['contactInfo']
      loading: QueryLoading
      networkStatus: QueryNetworkStatus
      fetchMore: QueryFetchMore<ContactInfoQuery, ContactInfoQueryVariables>
    }
  }
  /**
   * Mutation
   */
  mutation: {
    /**
     * メッセージ削除
     */
    deleteMessage: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = ChatProps

/** Presenter Component */
const ChatPresenter: React.VFC<PresenterProps> = ({
  query: { contactInfo },
  mutation: { deleteMessage },
  onApplyccdOpen,
  onApproveccdOpen,
  onUbccdOpen,
  ...props
}) => (
  <Box {...{ h: '100%', align: 'center' }}>
    <WorkflowCard {...{ onApplyccdOpen, onApproveccdOpen, onUbccdOpen }} query={{ contactInfo }} />
  </Box>
)

/** Container Component */
const ChatContainer: React.VFC<ContainerProps<ChatProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Chat */
export default connect<ChatProps, PresenterProps>('Chat', ChatPresenter, ChatContainer)
