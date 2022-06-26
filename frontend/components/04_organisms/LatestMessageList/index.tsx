import Scrollbar, { ScrollbarProps } from 'components/02_interactions/Scrollbar'
import ContactCard, { ContactCardProps } from 'components/03_molecules/ContactCard'
import { connect } from 'components/hoc'
import { ContactInfoQuery, ContactInfoQueryVariables, LatestMessagesQuery, MeQuery } from 'graphql/generated'
import React from 'react'
import { ContactInfoUserId, ContainerProps, OnClose, QueryRefetch, SetState, Unbox } from 'types'
import { toStr } from 'utils/general/helper'
import { getLatestMessage } from 'utils/helper'

/** LatestMessageList Props */
export type LatestMessageListProps = ScrollbarProps & {
  /**
   * サイドバー onClose
   */
  onSbClose: OnClose
  /**
   * Local State
   */
  state: {
    /**
     *  コンタクト情報 ユーザーID
     */
    contactInfoUserId: {
      state: ContactInfoUserId
      setContactInfoUserId: SetState<ContactInfoUserId>
    }
  }
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
export type PresenterProps = Omit<LatestMessageListProps, 'onSbClose' | 'state' | 'query'> & {
  latestMessageList?: (ContactCardProps & { key: Unbox<LatestMessagesQuery['latestMessages']>['userId'] })[]
}

/** Presenter Component */
const LatestMessageListPresenter: React.VFC<PresenterProps> = ({ latestMessageList, ...props }) => (
  <Scrollbar mt='0.25em' {...props}>
    {latestMessageList?.map(({ key, ...latestMessage }) => (
      <ContactCard key={key} {...latestMessage} />
    ))}
  </Scrollbar>
)

/** Container Component */
const LatestMessageListContainer: React.VFC<ContainerProps<LatestMessageListProps, PresenterProps>> = ({
  presenter,
  state: { contactInfoUserId },
  query: { me, latestMessages, contactInfo },
  onSbClose,
  ...props
}) => {
  const latestMessageList = latestMessages.result?.map((latestMessage) => ({
    key: latestMessage.userId,
    image: latestMessage.userAvatar ?? undefined,
    name: toStr(latestMessage.userName),
    content: getLatestMessage(latestMessage, toStr(me.result?.name)),
    active: contactInfoUserId.state === latestMessage.userId,
    unreadCount: latestMessage.unreadMessageCount,
    onClick: () => {
      contactInfoUserId.setContactInfoUserId(latestMessage.userId)
      contactInfo.refetch({ contactUserId: latestMessage.userId })
      onSbClose()
    }
  }))

  return presenter({ latestMessageList, ...props })
}

/** LatestMessageList */
export default connect<LatestMessageListProps, PresenterProps>(
  'LatestMessageList',
  LatestMessageListPresenter,
  LatestMessageListContainer
)
