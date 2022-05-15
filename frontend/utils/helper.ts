import { ALLOWED_IMAGE_EXTS, MESSAGE } from 'const'
import { LatestMessagesQuery } from 'graphql/generated'
import { VALIDATION_ERRORS } from 'messages/error'
import { CATEGORY_MESSAGE } from 'messages/message'
import { Unbox } from 'types'
import { isExtIncluded, toStr } from 'utils/general/helper'
import { hasProperty, includes, isNullish } from 'utils/general/object'

/**
 * 指定エラーコードのエラーメッセージを返す
 *
 * @param code - エラーコード
 * @param values - プレースホルダーに対応するプロパティ名にセットする値を持つオブジェクト
 * @returns エラーメッセージ
 */
export const getErrMsg = (code: string, values?: Record<string, string | number>): string => {
  let message = code
  if (hasProperty(VALIDATION_ERRORS, code)) {
    message = VALIDATION_ERRORS[code]
    if (!isNullish(values)) {
      for (const [key, value] of Object.entries(values)) {
        message = message.replace(`{${key}}`, toStr(value))
      }
    }
  }
  return message
}

/**
 * 最新メッセージのカテゴリに応じた表示メッセージを返す
 *
 * @param latestMessage - 最新メッセージオブジェクト
 * @param userName - サインインユーザー名
 * @returns 表示メッセージ
 */
export const getLatestMessage = (
  latestMessage: Unbox<LatestMessagesQuery['latestMessages']>,
  userName: string
): string => {
  // 送信者名
  const txUser = toStr(latestMessage.userId === latestMessage.txUserId ? latestMessage.userName : userName)

  // コンタクト申請, コンタクト承認, 画像送信
  if (
    includes(
      latestMessage.messageCategory,
      MESSAGE.CATEGORY.CONTACT_APPLICATION,
      MESSAGE.CATEGORY.CONTACT_APPROVAL,
      MESSAGE.CATEGORY.IMAGE_TRANSMISSION
    )
  ) {
    if (hasProperty(CATEGORY_MESSAGE, latestMessage.messageCategory)) {
      const message = toStr(CATEGORY_MESSAGE[latestMessage.messageCategory])
      return message.replace('{tx_user}', txUser)
    }
  }

  // 通話
  if (MESSAGE.CATEGORY.CALLING === latestMessage.messageCategory) {
    if (!isNullish(latestMessage.call)) {
      const CALLING_MESSAGE = CATEGORY_MESSAGE[MESSAGE.CATEGORY.CALLING]
      if (hasProperty(CALLING_MESSAGE, latestMessage.call.status)) {
        const message = CALLING_MESSAGE[latestMessage.call.status]
        return message.replace('{tx_user}', txUser)
      }
    }
  }

  return toStr(latestMessage.message)
}

/**
 * 指定のファイル名が許可された画像ファイル拡張子のものか否かを示す真偽値を返す
 *
 * @param filename - 判定対象のファイル名
 * @returns ファイル名が許可された画像ファイル拡張子のものか否かを示す真偽値
 */
export const isAllowedImageFile = (filename: string | undefined): boolean =>
  isExtIncluded(filename, ...ALLOWED_IMAGE_EXTS)
