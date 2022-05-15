import { CALL, CONTACT, MESSAGE } from 'const'
import {
  ContactInfoQuery,
  ContactInfoQueryVariables,
  ContactsQuery,
  LatestMessagesQuery,
  MeQuery,
  SearchUserQuery,
  SearchUserQueryVariables
} from 'graphql/generated'
import { toStr, zf } from 'utils/general/helper'
import {
  LazyQueryFunction,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  QueryRefetch
} from '../types'

//  ----------------------------------------------------------------------------
//  generator
//  ----------------------------------------------------------------------------

export function dummyMutation<Result, TData, TVariables>(
  name: string,
  result?: Result,
  loading?: MutaionLoading
): {
  result?: Result
  loading: MutaionLoading
  reset: MutaionReset
  mutate: MutateFunction<TData, TVariables>
} {
  return {
    result,
    loading: !!loading,
    reset: () => alert(`${name} Mutation - Reset`),
    mutate: () => {
      alert(`${name} Mutation - Mutate`)
      return Promise.resolve({ data: undefined, extensions: undefined, context: undefined })
    }
  }
}

export function dummyMe(userId: number): MeQuery['me'] {
  return {
    __typename: 'User',
    email: 'test-email@example.com',
    id: toStr(userId),
    code: 'code01',
    name: 'testuser01',
    comment: 'fine',
    avatar:
      'https://1.bp.blogspot.com/-GqIjU--SM-k/X9lJl-pkCjI/AAAAAAABc68/hEhMB_uG-xEPzhgaRjBhgX24-niyVZUnwCNcBGAsYHQ/s637/pose_reiwa_woman.png'
  }
}

export function dummyContacts(len: number, commentGen: (i: number) => string | undefined): ContactsQuery['contacts'] {
  const contacts: ContactsQuery['contacts'] = []
  for (let i = 1; i <= len; i++) {
    const r = Math.floor(Math.random() * Math.floor(2))
    contacts.push({
      __typename: 'Contact',
      id: toStr(i),
      userId: toStr(i),
      userCode: `user${zf(i, 3)}`,
      userName: `鈴木${i + (r ? '子' : '郎')}`,
      userComment: commentGen(i),
      userAvatar: illustya[r],
      status: CONTACT.STATUS.APPROVED,
      blocked: false
    })
  }
  return contacts
}

export function dummyLatestMessages(
  userId: number,
  len: number,
  messageGen: (i: number) => string | undefined
): LatestMessagesQuery['latestMessages'] {
  const latestMessages: LatestMessagesQuery['latestMessages'] = []
  for (let i = 1; i <= len; i++) {
    const r = Math.floor(Math.random() * Math.floor(2))
    const cateLen = Object.keys(MESSAGE.CATEGORY).length
    const category = (i % cateLen) + 1
    const callStaLen = Object.keys(CALL.STATUS).length
    const callState = Math.floor(Math.random() * Math.floor(callStaLen)) + 1
    latestMessages.push({
      __typename: 'LatestMessage',
      userId: toStr(i),
      userCode: `user${zf(i, 3)}`,
      userName: `鈴木${i + (r ? '子' : '郎')}`,
      userAvatar: illustya[r],
      messageId: toStr(i),
      txUserId: r ? toStr(userId) : toStr(i),
      messageCategory: category,
      message: category === MESSAGE.CATEGORY.MESSAGE ? messageGen(i) : undefined,
      messageStatus: i % 6 != 0 ? MESSAGE.STATUS.UNREAD : MESSAGE.STATUS.READ,
      createdAt: '06/24/2022 18:10:14',
      unreadMessageCount: i % 3 === 0 ? 3 : 0,
      call:
        category === MESSAGE.CATEGORY.CALLING
          ? {
              __typename: 'Call',
              id: toStr(i),
              messageId: toStr(i),
              status: callState,
              startedAt: '06/24/2022 18:10:14',
              endedAt: '06/24/2022 18:40:14',
              callTime: 30
            }
          : undefined
    })
  }
  return latestMessages
}

export function dummyContactInfo(
  userId: number,
  otherUserId: number,
  loading: QueryLoading,
  networkStatus: QueryNetworkStatus,
  contactStatus: number,
  blocked: boolean,
  chatLen: number,
  messageGen: (i: number) => string | undefined
): {
  contactInfo: ContactInfoQuery['contactInfo']
  loading: QueryLoading
  networkStatus: QueryNetworkStatus
  refetch: QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
  fetchMore: QueryFetchMore<ContactInfoQuery, ContactInfoQueryVariables>
} {
  const chat: ContactInfoQuery['contactInfo']['chat'] = []
  for (let i = 0; i < chatLen; i++) {
    const r = Math.floor(Math.random() * Math.floor(2))
    const cateLen = Object.keys(MESSAGE.CATEGORY).length
    const category = (i % cateLen) + 1
    const callStaLen = Object.keys(CALL.STATUS).length
    const callState = Math.floor(Math.random() * Math.floor(callStaLen)) + 1
    chat.push({
      __typename: 'Message',
      id: toStr(i),
      txUserId: r ? toStr(userId) : toStr(otherUserId),
      rxUserId: r ? toStr(otherUserId) : toStr(userId),
      category: category,
      message: category === MESSAGE.CATEGORY.MESSAGE ? messageGen(i) : undefined,
      status: MESSAGE.STATUS.READ,
      createdAt: '06/24/2022 18:40:14',
      call:
        category === MESSAGE.CATEGORY.CALLING
          ? {
              __typename: 'Call',
              id: toStr(i),
              messageId: toStr(i),
              status: callState,
              startedAt: '06/24/2022 18:10:14',
              endedAt: '06/24/2022 18:40:14',
              callTime: 30
            }
          : undefined
    })
  }

  const contactInfo: ContactInfoQuery['contactInfo'] = {
    __typename: 'Contact',
    id: '1',
    userId: '2',
    userCode: `user001`,
    userName: `suzuki ichiro`,
    userComment: 'comment',
    userAvatar: illustya[0],
    status: contactStatus,
    blocked,
    chat
  }

  const refetch = (() => {
    alert('ContactInfo Query - refetch')
    return Promise.resolve({ data: undefined, loading: false, networkStatus: 7 })
  }) as unknown as QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
  const fetchMore = (() => alert('ContactInfo Query - fetchMore')) as unknown as QueryFetchMore<
    ContactInfoQuery,
    ContactInfoQueryVariables
  >

  return {
    contactInfo: contactInfo,
    loading,
    networkStatus,
    refetch,
    fetchMore
  }
}

export function dummySearchUser(
  loading: QueryLoading,
  len: number,
  commentGen: (i: number) => string | undefined
): {
  users: SearchUserQuery['searchUser']
  loading: QueryLoading
  getUsersByCode: LazyQueryFunction<SearchUserQuery, SearchUserQueryVariables>
} {
  const users: SearchUserQuery['searchUser'] = []
  for (let i = 1; i <= len; i++) {
    const r = Math.floor(Math.random() * Math.floor(2))
    users.push({
      __typename: 'User',
      id: toStr(i),
      code: `user${zf(i, 3)}`,
      name: `鈴木${i + (r ? '子' : '郎')}`,
      comment: commentGen(i),
      avatar: illustya[r]
    })
  }

  const getUsersByCode = (() => alert('SearchUser LazyQuery - getUsersByCode')) as unknown as LazyQueryFunction<
    SearchUserQuery,
    SearchUserQueryVariables
  >

  return {
    users,
    loading,
    getUsersByCode
  }
}

/** イラスト屋 イラスト */
const illustya = [
  // 男
  'https://1.bp.blogspot.com/-Na00Q49BuPg/XJB5IFwcscI/AAAAAAABR8g/aWBDjkVwnHU2CVeLX2dgklqWQdz03DU4wCLcBGAs/s800/pistol_pose_man.png',
  // 女
  'https://1.bp.blogspot.com/-gTf4sWnRdDw/X0B4RSQQLrI/AAAAAAABarI/MJ9DW90dSVwtMjuUoErxemnN4nPXBnXUwCNcBGAsYHQ/s1600/otaku_girl_fashion.png'
]

//  ----------------------------------------------------------------------------
//  dummies
//  ----------------------------------------------------------------------------

/** Signed-in User ID */
export const userId = 200

/** Contact Info User ID */
export const otherUserId = 3

/** Me */
export const me = dummyMe(userId)

/** Contacts */
export const contacts = dummyContacts(100, (i) => (i % 3 != 0 ? `status message${i}` : undefined))

/** Latest Messages */
export const latestMessages = dummyLatestMessages(userId, 100, (i) => `I would like to reiterate${i}`)

/** Contact Info */
export const contactInfo = dummyContactInfo(userId, otherUserId, false, 7, 2, false, 50, (i) => `chat message${i}`)
