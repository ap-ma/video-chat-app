import { ALLOWED_IMAGE_EXTS, CALL, MESSAGE } from 'const'
import { ContactInfoQuery, LatestMessagesQuery } from 'graphql/generated'
import { VALIDATION_ERRORS } from 'messages/error'
import { CATEGORY_MESSAGE } from 'messages/message'
import { Unbox } from 'types'
import { formatMinTime, isExtIncluded, toStr } from 'utils/general/helper'
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
 * メッセージのカテゴリに応じた表示メッセージを返す
 *
 * @param message - メッセージオブジェクト
 * @param contactInfo - コンタクト情報オブジェクト
 * @param userName - サインインユーザー名
 * @returns 表示メッセージ
 */
export const getMessage = (
  message: Unbox<ContactInfoQuery['contactInfo']['chat']>,
  contactInfo: ContactInfoQuery['contactInfo'],
  userName: string
): string => {
  // 送信者名
  const txUser = toStr(message.txUserId === contactInfo.userId ? contactInfo.userName : userName)

  // コンタクト申請, コンタクト承認
  if (includes(message.category, MESSAGE.CATEGORY.CONTACT_APPLICATION, MESSAGE.CATEGORY.CONTACT_APPROVAL)) {
    if (hasProperty(CATEGORY_MESSAGE, message.category)) {
      const dispMessage = toStr(CATEGORY_MESSAGE[message.category])
      return dispMessage.replace('{tx_user}', txUser).replace('{other_user}', toStr(contactInfo.userName))
    }
  }

  // 通話
  if (MESSAGE.CATEGORY.CALLING === message.category) {
    if (!isNullish(message.call)) {
      const dispMessage: Array<string> = []
      const CALLING_MESSAGE = CATEGORY_MESSAGE[MESSAGE.CATEGORY.CALLING]
      if (hasProperty(CALLING_MESSAGE, message.call.status)) {
        dispMessage.push(CALLING_MESSAGE[message.call.status])
        if (CALL.STATUS.ENDED === message.call.status) {
          if (!isNullish(message.call.callTime)) {
            dispMessage.push(formatMinTime(message.call.callTime))
          }
        }
        return dispMessage.join('\n').replace('{tx_user}', txUser)
      }
    }
  }

  return toStr(message.message)
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
      const dispMessage = toStr(CATEGORY_MESSAGE[latestMessage.messageCategory])
      return dispMessage.replace('{tx_user}', txUser).replace('{other_user}', toStr(latestMessage.userName))
    }
  }

  // 通話
  if (MESSAGE.CATEGORY.CALLING === latestMessage.messageCategory) {
    if (!isNullish(latestMessage.call)) {
      const CALLING_MESSAGE = CATEGORY_MESSAGE[MESSAGE.CATEGORY.CALLING]
      if (hasProperty(CALLING_MESSAGE, latestMessage.call.status)) {
        const dispMessage = CALLING_MESSAGE[latestMessage.call.status]
        return dispMessage.replace('{tx_user}', txUser)
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
