import { FieldPolicy, Reference, StoreObject } from '@apollo/client'
import { ReadFieldFunction, SafeReadonly } from '@apollo/client/cache/core/types/common'
import { isNullish } from 'utils/impl/object'

/**
 * カーソルベースページネーションのFieldPolicyを返す
 *
 * @param keyArgs キャッシュストレージのキー
 * @param cursorKey カーソルのフィールド名
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
 * @param items カーソルを探索する対象のリスト
 * @param cursorKey カーソルのフィールド名
 * @param cursor カーソル
 * @param readField 正規化/非正規オブジェクトを問わず、指定フィールドを読み込めるヘルパ関数
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
