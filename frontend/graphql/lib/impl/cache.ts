import { ApolloCache, FieldPolicy, Reference, StoreObject } from '@apollo/client'
import { ReadFieldFunction, SafeReadonly } from '@apollo/client/cache/core/types/common'
import {
  ChatHistory,
  ChatHistoryFieldsFragmentDoc,
  ContactInfoDocument,
  ContactInfoQuery,
  ContactInfoQueryVariables,
  MeDocument,
  MeQuery,
  MeQueryVariables,
  Message,
  MessageChanged,
  MessageFieldsFragmentDoc,
  MutationType
} from 'graphql/generated'
import { ReadFieldParam } from 'types'
import { isNullish } from 'utils/impl/object'

/**
 * メッセージ登録更新時キャッシュ更新処理
 *
 * @param cache - 更新するApolloCache
 * @param messageChanged - メッセージ変更オブジェクト
 * @returns void
 */
export function updateChatCache(cache: ApolloCache<unknown>, messageChanged: MessageChanged): void {
  // ユーザー情報
  const meQuery = cache.readQuery<MeQuery, MeQueryVariables>({ query: MeDocument })
  if (isNullish(meQuery)) return
  const me = meQuery.me

  // 相手ユーザーIDの特定
  let otherUserId: string | undefined
  if (me.id === messageChanged.txUserId) otherUserId = messageChanged.rxUserId
  if (me.id === messageChanged.rxUserId) otherUserId = messageChanged.txUserId
  if (isNullish(otherUserId)) return

  // チャット履歴の更新
  cache.modify({
    fields: {
      chatHistory(existingChatHistory = [], { readField }) {
        // メッセージ新規作成
        if (MutationType.Created === messageChanged.mutationType) {
          const included = existingChatHistory.some(
            (chatHisRef: ReadFieldParam) => readField('userId', chatHisRef) === otherUserId
          )
          // 対象ユーザーのチャット履歴がキャッシュに存在しない場合
          if (!included && !isNullish(messageChanged.latestChat)) {
            const newChatRef = cache.writeFragment<ChatHistory>({
              data: messageChanged.latestChat,
              fragment: ChatHistoryFieldsFragmentDoc
            })
            existingChatHistory = [newChatRef, ...existingChatHistory]
          }
        }

        // メッセージ削除
        if (MutationType.Deleted === messageChanged.mutationType) {
          // 最新メッセージとして表示できるチャットがなくなった場合
          if (isNullish(messageChanged.latestChat)) {
            // チャット履歴から対象ユーザーの項目を削除
            existingChatHistory = existingChatHistory.filter(
              (chatRef: ReadFieldParam) => readField('userId', chatRef) !== otherUserId
            )
          }
        }

        // メッセージIDの降順でソート
        const newChatHistory = existingChatHistory
          .filter(Boolean)
          .sort((x: ReadFieldParam, y: ReadFieldParam) => {
            const xId = Number(readField('messageId', x))
            const yId = Number(readField('messageId', y))
            return yId - xId
          })

        return newChatHistory
      }
    }
  })

  // キャッシュに保存されているコンタクトユーザーの取得
  const contactInfo = cache.readQuery<ContactInfoQuery, ContactInfoQueryVariables>({
    query: ContactInfoDocument,
    variables: { contactUserId: otherUserId }
  })

  // 対象のコンタクト情報がまだキャッシュに存在しない場合は処理を終了
  if (isNullish(contactInfo)) return

  // コンタクト情報（チャット）の更新
  cache.modify({
    id: cache.identify(contactInfo.contactInfo),
    fields: {
      chat(existingChat = [], { readField }) {
        // メッセージ新規作成
        if (MutationType.Created === messageChanged.mutationType) {
          if (!isNullish(messageChanged.message)) {
            const newChatRef = cache.writeFragment<Message>({
              data: messageChanged.message,
              fragment: MessageFieldsFragmentDoc
            })
            existingChat = [newChatRef, ...existingChat]
          }
        }

        // メッセージ削除
        if (MutationType.Deleted === messageChanged.mutationType) {
          existingChat = existingChat.filter(
            (messageRef: ReadFieldParam) =>
              readField('id', messageRef) !== messageChanged.message?.id
          )
        }

        // IDの降順でソート
        const newChat = existingChat
          .filter(Boolean)
          .sort((x: ReadFieldParam, y: ReadFieldParam) => {
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
      return merged as SafeReadonly<TExisting>
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
