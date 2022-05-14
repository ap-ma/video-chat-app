import Scrollbar, { ScrollbarProps } from 'components/02_interactions/Scrollbar'
import UserCard, { UserCardProps } from 'components/04_organisms/UserCard'
import { connect } from 'components/hoc'
import { ContactInfoQuery, ContactInfoQueryVariables, LatestMessagesQuery } from 'graphql/generated'
import React from 'react'
import { ContainerProps, QueryRefetch } from 'types'
import { toStr } from 'utils/general/helper'

/** ChatList Props */
export type ChatListProps = ScrollbarProps & {
  /**
   * メッセージ一覧
   */
  latestMessages?: LatestMessagesQuery['latestMessages']
  /**
   * Query
   */
  query: {
    /**
     *  コンタクト情報
     */
    contactInfo: {
      refetch: QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ChatListProps, 'query'> & {
  chats?: UserCardProps[]
}

/** Presenter Component */
const ChatListPresenter: React.VFC<PresenterProps> = ({ chats, ...props }) => (
  <Scrollbar {...props}>
    {chats?.map((chat, i) => (
      <UserCard key={i} {...chat} />
    ))}
  </Scrollbar>
)

/** Container Component */
const ChatListContainer: React.VFC<ContainerProps<ChatListProps, PresenterProps>> = ({
  presenter,
  latestMessages,
  query: { contactInfo },
  ...props
}) => {
  const chats = latestMessages?.map((message) => {
    return {
      image: message.userAvatar ?? undefined,
      name: toStr(message.userName),
      content: message.message ?? undefined,
      active: false,
      unreadCount: message.unreadMessageCount,
      onClick: () => contactInfo.refetch({ contactUserId: message.userId })
    }
  })

  return presenter({ chats, ...props })
}

/** ChatList */
export default connect<ChatListProps, PresenterProps>('ChatList', ChatListPresenter, ChatListContainer)
