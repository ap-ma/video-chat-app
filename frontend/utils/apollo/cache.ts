import { ApolloCache, FieldPolicy, Reference, StoreObject } from '@apollo/client'
import { ReadFieldFunction, SafeReadonly } from '@apollo/client/cache/core/types/common'
import {
  Contact,
  ContactFieldsFragmentDoc,
  ContactInfoDocument,
  ContactInfoQuery,
  ContactInfoQueryVariables,
  LatestMessage,
  LatestMessageFieldsFragmentDoc,
  MeDocument,
  MeQuery,
  MeQueryVariables,
  Message,
  MessageChanged,
  MessageFieldsFragmentDoc,
  MutationType
} from 'graphql/generated'
import { Optional, ReadFieldParam } from 'types'
import { isNullish } from 'utils/general/object'
import { isApproveContact } from './utils'

/**
 * メッセージ登録更新時キャッシュ更新処理
 *
 * @param cache - 更新するApolloCache
 * @param messageChanged - メッセージ変更オブジェクト
 * @returns void
 */
export function updateMessageCache(cache: ApolloCache<unknown>, messageChanged: MessageChanged): void {
  // ユーザー情報
  const meQuery = cache.readQuery<MeQuery, MeQueryVariables>({ query: MeDocument })
  if (isNullish(meQuery)) return
  const me = meQuery.me

  // 相手ユーザーIDの特定
  let otherUserId: string | undefined
  if (me.id === messageChanged.txUserId) otherUserId = messageChanged.rxUserId
  if (me.id === messageChanged.rxUserId) otherUserId = messageChanged.txUserId
  if (isNullish(otherUserId)) return

  // メッセージ一覧の更新
  cache.modify({
    fields: {
      latestMessages(existingLatestMessages = [], { readField }) {
        // メッセージ新規作成
        if (MutationType.Created === messageChanged.mutationType) {
          const included = existingLatestMessages.some(
            (latestMessageRef: ReadFieldParam) => readField('userId', latestMessageRef) === otherUserId
          )

          // メッセージ一覧のキャッシュに対象ユーザーのデータが存在しない場合
          if (!included && !isNullish(messageChanged.latestMessage)) {
            const newLatestMessageRef = cache.writeFragment<LatestMessage>({
              data: messageChanged.latestMessage,
              fragment: LatestMessageFieldsFragmentDoc,
              fragmentName: 'LatestMessageFields'
            })
            existingLatestMessages = [newLatestMessageRef, ...existingLatestMessages]
          }
        }

        // メッセージ削除
        if (MutationType.Deleted === messageChanged.mutationType) {
          // 最新メッセージとして表示できるチャットがなくなった場合
          if (isNullish(messageChanged.latestMessage)) {
            // チャット履歴から対象ユーザーのデータを削除
            existingLatestMessages = existingLatestMessages.filter(
              (chatRef: ReadFieldParam) => readField('userId', chatRef) !== otherUserId
            )
          }
        }

        // メッセージIDの降順でソート
        const newLatestMessages = existingLatestMessages
          .filter(Boolean)
          .sort((x: ReadFieldParam, y: ReadFieldParam) => {
            const xId = Number(readField('messageId', x))
            const yId = Number(readField('messageId', y))
            return yId - xId
          })

        return newLatestMessages
      }
    }
  })

  // 更新時はコンタクト情報キャッシュへの明示的な処理なし
  if (MutationType.Updated === messageChanged.mutationType) return

  // キャッシュに保存されているコンタクトユーザーの取得
  const contactInfo = cache.readQuery<ContactInfoQuery, ContactInfoQueryVariables>({
    query: ContactInfoDocument,
    variables: { contactUserId: otherUserId }
  })

  // 対象のコンタクト情報がまだキャッシュに存在しない場合は処理を終了
  if (isNullish(contactInfo)) return

  // コンタクト情報の更新
  cache.modify({
    id: cache.identify(contactInfo.contactInfo),
    fields: {
      id(existingId) {
        return isApproveContact(messageChanged) && !isNullish(messageChanged.contactId)
          ? messageChanged.contactId
          : existingId
      },
      status(existingStatus) {
        return isApproveContact(messageChanged) && !isNullish(messageChanged.contactStatus)
          ? messageChanged.contactStatus
          : existingStatus
      },
      chatCount(existingChatCount) {
        if (MutationType.Created === messageChanged.mutationType) existingChatCount++
        if (MutationType.Deleted === messageChanged.mutationType) existingChatCount--
        return existingChatCount
      },
      chatDateCount(existingChatDateCount) {
        if (!isNullish(messageChanged.message)) {
          const createdDate = messageChanged.message.createdAt.substring(0, 10)
          const chat = contactInfo.contactInfo.chat
          const sameDate = chat.filter((message) => createdDate === message.createdAt.substring(0, 10))
          if (MutationType.Created === messageChanged.mutationType) {
            if (sameDate.length === 0) existingChatDateCount++
          }
          if (MutationType.Deleted === messageChanged.mutationType) {
            if (sameDate.length === 1) existingChatDateCount--
          }
        }

        return existingChatDateCount
      },
      chat(existingChat = [], { readField }) {
        // メッセージ新規作成
        if (MutationType.Created === messageChanged.mutationType) {
          if (!isNullish(messageChanged.message)) {
            const newMessageRef = cache.writeFragment<Message>({
              data: messageChanged.message,
              fragment: MessageFieldsFragmentDoc,
              fragmentName: 'MessageFields'
            })
            existingChat = [newMessageRef, ...existingChat]
          }
        }

        // メッセージ削除
        if (MutationType.Deleted === messageChanged.mutationType) {
          existingChat = existingChat.filter(
            (messageRef: ReadFieldParam) => readField('id', messageRef) !== messageChanged.message?.id
          )
        }

        // IDの降順でソート
        const newChat = existingChat.filter(Boolean).sort((x: ReadFieldParam, y: ReadFieldParam) => {
          const xId = Number(readField('id', x))
          const yId = Number(readField('id', y))
          return yId - xId
        })

        return newChat
      }
    }
  })
}

/**
 * コンタクト更新時キャッシュ更新処理
 *
 * @param cache - 更新するApolloCache
 * @param contact - コンタクトオブジェクト
 * @param operation - 処理種別
 * @returns void
 */
export function updateContactCache(
  cache: ApolloCache<unknown>,
  contact: Optional<Contact, 'chat' | 'chatCount' | 'chatDateCount'>,
  operation: 'ADD' | 'DELETE'
): void {
  // コンタクト一覧の更新
  cache.modify({
    fields: {
      contacts(existingContacts = [], { readField }) {
        // コンタクト一覧から削除
        if (operation === 'DELETE') {
          return existingContacts.filter((contactRef: ReadFieldParam) => readField('id', contactRef) !== contact.id)
        }

        // コンタクト一覧に追加
        if (operation === 'ADD') {
          const newContactRef = cache.writeFragment<typeof contact>({
            data: contact,
            fragment: ContactFieldsFragmentDoc
          })

          // ユーザー名の昇順でソート
          const newContacts = [newContactRef, ...existingContacts].sort((x: ReadFieldParam, y: ReadFieldParam) => {
            const xUserName = readField('userName', x) as string
            const yUserName = readField('userName', y) as string
            if (yUserName > xUserName) return -1
            if (xUserName < yUserName) return 1
            return 0
          })

          return newContacts
        }

        return existingContacts
      }
    }
  })

  // メッセージ一覧の更新
  cache.modify({
    fields: {
      latestMessages(existingLatestMessages = [], { readField }) {
        // コンタクトがブロック済
        if (contact.blocked) {
          // メッセージ一覧から対象ユーザーのデータを削除
          return existingLatestMessages.filter(
            (chatRef: ReadFieldParam) => readField('userId', chatRef) !== contact.userId
          )
        }

        // メッセージ一覧のキャッシュに対象ユーザーのデータが存在するか
        const included = existingLatestMessages.some(
          (latestMessageRef: ReadFieldParam) => readField('userId', latestMessageRef) === contact.userId
        )

        // メッセージ一覧内に対象ユーザーのデータがない場合
        if (!included && !isNullish(contact.latestMessage)) {
          const newLatestMessageRef = cache.writeFragment<LatestMessage>({
            data: contact.latestMessage,
            fragment: LatestMessageFieldsFragmentDoc,
            fragmentName: 'LatestMessageFields'
          })

          // メッセージ一覧に最新メッセージを追加
          const newLatestMessages = [newLatestMessageRef, ...existingLatestMessages]
            .filter(Boolean)
            .sort((x: ReadFieldParam, y: ReadFieldParam) => {
              const xId = Number(readField('messageId', x))
              const yId = Number(readField('messageId', y))
              return yId - xId
            })

          return newLatestMessages
        }

        return existingLatestMessages
      }
    }
  })
}

/**
 * カーソルベースページネーションのFieldPolicyを返す
 *
 * @param keyArgs - キャッシュストレージのキー
 * @param cursorKey - カーソルのフィールド名
 * @returns カーソルベースページネーションのFieldPolicy
 */
export function cursorPagination<TExisting extends Array<StoreObject | Reference>>(
  keyArgs?: FieldPolicy['keyArgs'],
  cursorKey = 'id'
): FieldPolicy<TExisting> {
  if (isNullish(keyArgs)) keyArgs = false
  return {
    keyArgs,
    merge(existing, incoming, { args, readField }) {
      const merged = !isNullish(existing) ? existing.slice() : []
      let offset = offsetFromCursor(merged, cursorKey, args?.cursor, readField)
      if (offset < 0) offset = merged.length
      incoming.forEach((item, i) => (merged[offset + i] = item))
      return getUniqueItems(merged, cursorKey, readField) as SafeReadonly<TExisting>
    }
  }
}

/**
 * 指定のカーソルがリストのどの位置を指すか特定し、その次のインデックスを返す
 *
 * @param items - カーソルを探索する対象のリスト
 * @param cursorKey - カーソルのフィールド名
 * @param cursor - カーソル
 * @param readField - 正規化/非正規オブジェクトを問わず、指定フィールドを読み込めるヘルパ関数
 * @returns 指定カーソルが示すオブジェクトのインデックスの次の値
 */
function offsetFromCursor(
  items: Array<StoreObject | Reference>,
  cursorKey: string,
  cursor: string,
  readField: ReadFieldFunction
) {
  for (let i = items.length - 1; i >= 0; --i) {
    if (readField(cursorKey, items[i]) === cursor) {
      return i + 1
    }
  }
  return -1
}

/**
 * 指定のリストから識別子の重複する要素を取り除き、新しい配列を生成して返す
 *
 * @param items - カーソルを探索する対象のリスト
 * @param key - オブジェクト識別子のフィールド名
 * @param readField - 正規化/非正規オブジェクトを問わず、指定フィールドを読み込めるヘルパ関数
 * @returns 重複要素が取り除かれた配列
 */
function getUniqueItems(items: Array<StoreObject | Reference>, key: string, readField: ReadFieldFunction) {
  const result = []
  const map = new Map()
  for (const item of items) {
    const id = readField(key, item)
    if (!map.get(id)) {
      map.set(id, true)
      result.push(item)
    }
  }
  return result
}
