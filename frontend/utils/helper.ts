import { ALLOWED_IMAGE_EXTS } from 'const'
import { VALIDATION_ERRORS } from 'messages/error'
import { isExtIncluded, toStr } from 'utils/general/helper'
import { hasProperty, isNullish } from 'utils/general/object'

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
 * 指定のファイル名が許可された画像ファイル拡張子のものか否かを示す真偽値を返す
 *
 * @param filename - 判定対象のファイル名
 * @returns ファイル名が許可された画像ファイル拡張子のものか否かを示す真偽値
 */
export const isAllowedImageFile = (filename: string | undefined): boolean =>
  isExtIncluded(filename, ...ALLOWED_IMAGE_EXTS)
