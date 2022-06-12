import { NetworkStatus } from '@apollo/client'
import { Box } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import Scrollbar, { ScrollbarProps } from 'components/02_interactions/Scrollbar'
import { connect } from 'components/hoc'
import {
  ContactInfoQuery,
  ContactInfoQueryVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables
} from 'graphql/generated'
import groupBy from 'lodash/groupBy'
import React, { forwardRef, useCallback, useMemo } from 'react'
import { GroupedVirtuoso } from 'react-virtuoso'
import {
  ContainerProps,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus
} from 'types'
import { first, includes, isNonEmptyArray, isNullish } from 'utils/general/object'

/** MessageList Props */
export type MessageListProps = ScrollbarProps & {
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
      reset: MutaionReset
      mutate: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<MessageListProps, 'query'> & {
  messageList?: ContactInfoQuery['contactInfo']['chat']
  groupCounts: number[]
  dates: string[]
  loadMore: () => void
}

/** Presenter Component */
const MessageListPresenter: React.VFC<PresenterProps> = ({
  mutation: { deleteMessage },
  messageList,
  groupCounts,
  dates,
  loadMore,
  ...props
}) => (
  <GroupedVirtuoso
    groupCounts={groupCounts}
    groupContent={(index) => (
      <Box bg='white' py='3px' borderBottom='1px solid #ccc'>
        {dates[index]}
      </Box>
    )}
    itemContent={(index) => <div style={{ padding: '50px' }}>{messageList ? messageList[index]?.message : ''}</div>}
    increaseViewportBy={10000}
    followOutput
    components={{
      Scroller: forwardRef(function Scroller({ style, ...props }, ref) {
        return <Scrollbar style={{ ...style }} ref={ref} {...props} />
      })
    }}
  />
)

/** Container Component */
const MessageListContainer: React.VFC<ContainerProps<MessageListProps, PresenterProps>> = ({
  presenter,
  query: { contactInfo },
  ...props
}) => {
  const chat = contactInfo.result?.chat
  const messageList = useMemo(() => chat?.slice().reverse(), [chat])

  const grouped = useMemo(() => groupBy(messageList, (message) => message.createdAt.substring(0, 10)), [messageList])
  const groupCounts = useMemo(() => Object.values(grouped).map((messages) => messages.length), [grouped])
  const dates = useMemo(() => Object.keys(grouped), [grouped])

  const loadMore = useCallback(() => {
    if (includes(contactInfo.networkStatus, NetworkStatus.fetchMore)) return
    if (isNullish(messageList) || !isNonEmptyArray(messageList)) return
    const cursor = first(messageList).id
    contactInfo.fetchMore({ variables: { cursor } }).catch(toast('UnexpectedError'))
  }, [contactInfo, messageList])

  return presenter({
    messageList,
    groupCounts,
    dates,
    loadMore,
    ...props
  })
}

/** MessageList */
export default connect<MessageListProps, PresenterProps>('MessageList', MessageListPresenter, MessageListContainer)
