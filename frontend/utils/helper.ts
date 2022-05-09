import { ALLOWED_IMAGE_EXTS } from 'const'
import { VALIDATION_ERRORS } from 'messages/error'
import { ValidationErrors } from 'types'
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
 * GraphQLErrors(ValidationErrors)をReact hook formのFieldErrorsにセットする
 * Formのフィールドに存在しないキーを持つエラーが含まれる場合、対象エラーのメッセージを配列に格納して返す
 *
 * @param formFields - form内のフィールド名の配列
 * @param setError - setError関数
 * @param errors - ValidationErrors
 * @param values - プレースホルダーにセットする値を持つオブジェクトをフィールド毎に格納したオブジェクト
 * @returns FormのFieldに存在しないキーを持つエラーのメッセージを格納した配列
 */
export const setGqlErrorsToFieldErrors = <T>(
  formFields: Array<string | number>,
  setError: (fieldName: keyof T, error: { type: string; message: string }) => void,
  errors: ValidationErrors | undefined,
  values?: Record<string, Parameters<typeof getErrMsg>[1]>
): Array<string> => {
  const characteristic: Array<string> = []
  errors?.forEach((error) => {
    const field = error.extensions.field
    const message = getErrMsg(error.message, !isNullish(values) ? values[field] : undefined)

    if (formFields.includes(field)) {
      setError(field as keyof T, { type: 'custom', message })
    } else {
      characteristic.push(message)
    }
  })

  return characteristic
}

/**
 * 指定のファイル名が許可された画像ファイル拡張子のものか否かを示す真偽値を返す
 *
 * @param filename - 判定対象のファイル名
 * @returns ファイル名が許可された画像ファイル拡張子のものか否かを示す真偽値
 */
export const isAllowedImageFile = (filename: string | undefined): boolean =>
  isExtIncluded(filename, ...ALLOWED_IMAGE_EXTS)
