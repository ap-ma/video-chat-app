import { NetworkStatus } from '@apollo/client'
import { Box } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import Scrollbar from 'components/02_interactions/Scrollbar'
import Message from 'components/04_organisms/Message'
import { connect } from 'components/hoc'
import {
  ContactInfoQuery,
  ContactInfoQueryVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  MeQuery
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

/** Chat Props */
export type ChatProps = JSX.IntrinsicElements['div'] & {
  /**
   * Query
   */
  query: {
    /**
     * ユーザー情報
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
      result?: DeleteMessageMutation['deleteMessage']
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = ChatProps & {
  messageList?: ContactInfoQuery['contactInfo']['chat']
  groupCounts: number[]
  dates: string[]
  loadMore: () => void
}

/** Presenter Component */
const ChatPresenter: React.VFC<PresenterProps> = ({
  query: { me, contactInfo },
  mutation: { deleteMessage },
  messageList,
  groupCounts,
  dates,
  loadMore,
  ...props
}) => (
  <GroupedVirtuoso
    style={{ ...props }}
    groupCounts={groupCounts}
    groupContent={(index) => (
      <Box bg='white' py='0.5' borderBottom='1px solid #ccc'>
        {dates[index]}
      </Box>
    )}
    itemContent={(index) => (
      <Message message={messageList[index]} query={{ me, contactInfo }} mutation={{ deleteMessage }} />
    )}
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
const ChatContainer: React.VFC<ContainerProps<ChatProps, PresenterProps>> = ({
  presenter,
  query: { contactInfo, ...queryRest },
  mutation: { deleteMessage },
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
    query: { contactInfo, ...queryRest },
    mutation: { deleteMessage },
    messageList,
    groupCounts,
    dates,
    loadMore,
    ...props
  })
}

/** Chat */
export default connect<ChatProps, PresenterProps>('Chat', ChatPresenter, ChatContainer)
