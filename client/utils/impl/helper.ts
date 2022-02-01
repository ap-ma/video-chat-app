import { isArray, isNullish } from 'utils/impl/object'

/**
 * 値を文字列表現に変換して返す
 *
 * @param value - 対象値
 * @returns 変換された文字列
 */
export const toStr = (value: unknown): string => {
  if (isArray(value)) {
    return value.map((elem) => (isNullish(elem) ? elem : toStr(elem))).join()
  }
  return isNullish(value) ? '' : `${value}`
}

/**
 * 未定義を含む文字列配列から文字列要素のみを半角スペース区切りで結合した文字列を返す
 *
 * @param classNames - 未定義を含む文字列の残余引数
 * @returns 文字列配列を半角スペース区切りで結合した文字列
 */
export const classNames = (...classNames: Array<string | undefined>): string =>
  classNames.filter(Boolean).join(' ')

/**
 * 文字列、数値を指定の長さまで0埋めした文字列を返す
 *
 * @param target - 対象文字列
 * @param [digit=0] - 最終的な文字列の長さ
 * @returns 0埋めされた文字列
 */
export const zf = (target: string | number, digit = 0): string => {
  if (typeof target === 'number') target = toStr(target)
  return padStr(target, '0', digit)
}

/**
 * 文字列を指定の長さになるまで他の文字列で延長した文字列を返す
 *
 * @param target - 対象文字列
 * @param padStr - 延長するために使用する文字列
 * @param digit - 最終的な文字列の長さ
 * @returns 延長した文字列
 */
export const padStr = (target: string, padStr: string, digit: number): string =>
  target.padStart(digit, padStr)

/**
 * 指定した範囲の各数値を要素にもつ配列を返す
 *
 * @param start - 範囲の開始数値
 * @param end - 範囲の終了数値
 * @param [step=1] - インクリメントまたはデクリメントする値
 * @returns startからendまでのstep刻みの配列
 */
export const range = (start: number, end: number, step = 1): number[] => {
  let index = -1,
    length = Math.max(Math.ceil((end - start) / (step || 1)), 0)
  const result: number[] = Array(length)

  while (length--) {
    result[++index] = start
    start += step
  }
  return result
}

/**
 * 指定誕生年月日の満年齢を返す
 *
 * @param year - 誕生年
 * @param month - 誕生月
 * @param date - 誕生日
 * @returns 年齢を示すNumber
 */
export const age = (
  year: string | number,
  month: string | number,
  date: string | number
): number => {
  const today = new Date()
  const tDate = Number(today.getFullYear() + zf(today.getMonth() + 1, 2) + zf(today.getDate(), 2))
  const bDate = Number(year + zf(month, 2) + zf(date, 2))
  return Math.floor((tDate - bDate) / 10000)
}

/**
 * setTimeoutをラップしたPromiseオブジェクトを返す
 *
 * @param result - Promiseを解決する値
 * @param delay - Promiseが解決される前に待つ時間 (1/1000 秒)
 * @returns 指定時間後に解決されるPromiseオブジェクト
 */
export const promiseSetTimeout = async <T>(result: T, delay: number): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), delay)
  })
}
