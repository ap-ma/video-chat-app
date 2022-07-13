import { useMemo } from 'react'
import { ValidationErrors } from 'types'
import { isNullish } from 'utils/general/object'
import { getErrMsg } from 'utils/helper'

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
export function useSetError<T>(
  formFields: Array<string | number>,
  setError: (fieldName: keyof T, error: { type: string; message: string }) => void,
  errors: ValidationErrors | undefined,
  values?: Record<string, Parameters<typeof getErrMsg>[1]>
): Array<string> {
  return useMemo(() => {
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
  }, [errors]) // eslint-disable-line react-hooks/exhaustive-deps
}
