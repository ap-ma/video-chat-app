import { Box, BoxProps } from '@chakra-ui/react'
import ApplyContactBox from 'components/04_organisms/_boxes/ApplyContactBox'
import ApproveContactBox from 'components/04_organisms/_boxes/ApproveContactBox'
import UnblockContactBox from 'components/04_organisms/_boxes/UnblockContactBox'
import { connect } from 'components/hoc'
import {
  ApplyContactMutation,
  ApplyContactMutationVariables,
  ApproveContactMutation,
  ApproveContactMutationVariables,
  ContactInfoQuery,
  ContactInfoQueryVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  MeQuery,
  UnblockContactMutation,
  UnblockContactMutationVariables
} from 'graphql/generated'
import React from 'react'
import {
  ContainerProps,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  ValidationErrors
} from 'types'

/** Chat Props */
export type ChatProps = BoxProps & {
  /**
   * Query
   */
  query: {
    /**
     * サインインユーザー情報
     */
    me: {
      result?: MeQuery['me']
    }
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
    /**
     * コンタクト申請
     */
    applyContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<ApplyContactMutation, ApplyContactMutationVariables>
    }
    /**
     * コンタクト承認
     */
    approveContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<ApproveContactMutation, ApproveContactMutationVariables>
    }
    /**
     * コンタクトブロック解除
     */
    unblockContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<UnblockContactMutation, UnblockContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = ChatProps

/** Presenter Component */
const ChatPresenter: React.VFC<PresenterProps> = ({
  query: { me, contactInfo },
  mutation: { deleteMessage, applyContact, approveContact, unblockContact },
  ...props
}) => (
  <Box h='100%' {...props}>
    <ApplyContactBox query={{ contactInfo }} mutation={{ applyContact }} />
    <ApproveContactBox query={{ me, contactInfo }} mutation={{ approveContact }} />
    <UnblockContactBox query={{ contactInfo }} mutation={{ unblockContact }} />
  </Box>
)

/** Container Component */
const ChatContainer: React.VFC<ContainerProps<ChatProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Chat */
export default connect<ChatProps, PresenterProps>('Chat', ChatPresenter, ChatContainer)
