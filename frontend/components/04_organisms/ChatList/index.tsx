import Scrollbar, { ScrollbarProps } from 'components/02_interactions/Scrollbar'
import UserCard, { UserCardProps } from 'components/04_organisms/UserCard'
import { connect } from 'components/hoc'
import { ContactInfoQuery, ContactInfoQueryVariables, LatestMessagesQuery, MeQuery } from 'graphql/generated'
import React from 'react'
import { ContainerProps, QueryRefetch } from 'types'
import { ContactInfoUserId, SetContactInfoUserId } from 'utils/apollo/state'
import { toStr } from 'utils/general/helper'
import { getLatestMessage } from 'utils/helper'

/** ChatList Props */
export type ChatListProps = Omit<ScrollbarProps, 'me'> & {
  /**
   * Local State
   */
  state: {
    /**
     *  コンタクト情報 ユーザーID
     */
    contactInfoUserId: {
      state: ContactInfoUserId
      setContactInfoUserId: SetContactInfoUserId
    }
  }
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
     * メッセージ一覧
     */
    latestMessages: {
      result?: LatestMessagesQuery['latestMessages']
    }
    /**
     *  コンタクト情報
     */
    contactInfo: {
      refetch: QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ChatListProps, 'me' | 'latestMessages' | 'state' | 'query'> & {
  chatList?: UserCardProps[]
}

/** Presenter Component */
const ChatListPresenter: React.VFC<PresenterProps> = ({ chatList, ...props }) => (
  <Scrollbar mt='0.25em' {...props}>
    {chatList?.map((chat) => (
      <UserCard key={chat.userId} {...chat} />
    ))}
  </Scrollbar>
)

/** Container Component */
const ChatListContainer: React.VFC<ContainerProps<ChatListProps, PresenterProps>> = ({
  presenter,
  state: { contactInfoUserId },
  query: { me, latestMessages, contactInfo },
  ...props
}) => {
  const chatList = latestMessages.result?.map((latestMessage) => ({
    userId: latestMessage.userId,
    image: latestMessage.userAvatar ?? undefined,
    name: toStr(latestMessage.userName),
    content: getLatestMessage(latestMessage, toStr(me.result?.name)),
    active: contactInfoUserId.state === latestMessage.userId,
    unreadCount: latestMessage.unreadMessageCount,
    onClick: () => {
      contactInfoUserId.setContactInfoUserId(latestMessage.userId)
      contactInfo.refetch({ contactUserId: latestMessage.userId })
    }
  }))

  return presenter({ chatList, ...props })
}

/** ChatList */
export default connect<ChatListProps, PresenterProps>('ChatList', ChatListPresenter, ChatListContainer)
