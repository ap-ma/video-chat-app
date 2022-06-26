import { NetworkStatus } from '@apollo/client'
import { Box, BoxProps, useDisclosure } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import Message, { MessageProps } from 'components/04_organisms/Message'
import DeleteMessageConfirmDialog from 'components/04_organisms/_dialogs/DeleteMessageConfirmDialog'
import { connect } from 'components/hoc'
import {
  ContactInfoQuery,
  ContactInfoQueryVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  MeQuery
} from 'graphql/generated'
import groupBy from 'lodash/groupBy'
import { nanoid } from 'nanoid'
import React, { Key, useCallback, useMemo, useState } from 'react'
import { Virtuoso, VirtuosoProps } from 'react-virtuoso'
import {
  ContainerProps,
  DeleteMessageId,
  Disclosure,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  SetState
} from 'types'
import { hasValue, includes, isBlank, isNonEmptyArray, isNullish, isString } from 'utils/general/object'

/** Chat Props */
export type ChatProps = BoxProps & {
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
  virtuosoKey: Key
  messageList?: MessageProps['message'][]
  firstItemIndex: VirtuosoProps<unknown, unknown>['firstItemIndex']
  initialTopMostItemIndex: VirtuosoProps<unknown, unknown>['initialTopMostItemIndex']
  loadMore: VirtuosoProps<unknown, unknown>['startReached']
  dmcdDisc: Disclosure
  deleteMessageId: DeleteMessageId
  setDeleteMessageId: SetState<DeleteMessageId>
}

/** Presenter Component */
const ChatPresenter: React.VFC<PresenterProps> = ({
  query: { me, contactInfo },
  mutation: { deleteMessage },
  virtuosoKey,
  messageList,
  firstItemIndex,
  initialTopMostItemIndex,
  loadMore,
  dmcdDisc,
  deleteMessageId,
  setDeleteMessageId,
  ...props
}) => (
  <Box h='full' {...props}>
    <Virtuoso
      key={virtuosoKey}
      increaseViewportBy={500}
      startReached={loadMore}
      data={messageList}
      firstItemIndex={firstItemIndex}
      initialTopMostItemIndex={initialTopMostItemIndex}
      itemContent={(_, message) => (
        <Message
          message={message}
          onDmcdOpen={dmcdDisc.onOpen}
          setDeleteMessageId={setDeleteMessageId}
          query={{ me, contactInfo }}
        />
      )}
    />
    <DeleteMessageConfirmDialog
      messageId={deleteMessageId}
      mutation={{ deleteMessage }}
      isOpen={dmcdDisc.isOpen}
      onClose={dmcdDisc.onClose}
    />
  </Box>
)

/** Container Component */
const ChatContainer: React.VFC<ContainerProps<ChatProps, PresenterProps>> = ({
  presenter,
  query: { contactInfo, ...queryRest },
  mutation: { deleteMessage },
  ...props
}) => {
  // list
  const [virtuosoKey, setVirtuosoKey] = useState(nanoid())
  useMemo(() => {
    if (!isNullish(contactInfo.result?.id)) setVirtuosoKey(nanoid())
  }, [contactInfo.result?.id])

  const messageList: PresenterProps['messageList'] = useMemo(() => {
    const chat = contactInfo.result?.chat?.slice().reverse()
    const grouped = groupBy(chat, (message) => message.createdAt.substring(0, 10))
    return Object.entries(grouped).flat().flat()
  }, [contactInfo.result?.chat])

  const firstItemIndex = useMemo(() => {
    const chatCount = contactInfo.result?.chatCount ?? 0
    const chatDateCount = contactInfo.result?.chatDateCount ?? 0
    const chatLength = messageList?.length ?? 0
    return chatCount + chatDateCount - chatLength
  }, [messageList, contactInfo.result])

  const initialTopMostItemIndex = useMemo(() => {
    if (isNullish(messageList) || isBlank(messageList)) return 0
    return messageList.length - 1
  }, [messageList])

  const loadMore = useCallback(() => {
    if (includes(contactInfo.networkStatus, NetworkStatus.fetchMore)) return
    if (isNullish(messageList) || !isNonEmptyArray(messageList)) return
    const firstItem = messageList.find((message) => !isString(message))
    const cursor = (firstItem as Exclude<typeof firstItem, string | undefined>).id
    contactInfo.fetchMore({ variables: { cursor } }).catch(toast('UnexpectedError'))
  }, [contactInfo, messageList])

  // DeleteMessageConfirmDialog modal
  const [deleteMessageId, setDeleteMessageId] = useState<DeleteMessageId>(undefined)
  const dmcdDisc = useDisclosure()
  const onDmcdClose = dmcdDisc.onClose
  const deleteMessageResult = deleteMessage.result
  useMemo(() => {
    if (hasValue(deleteMessageResult)) onDmcdClose()
  }, [onDmcdClose, deleteMessageResult])

  return presenter({
    query: { contactInfo, ...queryRest },
    mutation: { deleteMessage },
    virtuosoKey,
    messageList,
    firstItemIndex,
    initialTopMostItemIndex,
    loadMore,
    dmcdDisc,
    deleteMessageId,
    setDeleteMessageId,
    ...props
  })
}

/** Chat */
export default connect<ChatProps, PresenterProps>('Chat', ChatPresenter, ChatContainer)
