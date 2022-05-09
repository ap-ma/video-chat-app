import { default as browserImageCompression } from 'browser-image-compression'
import { includes, isArray, isNullish } from './object'

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
export const padStr = (target: string, padStr: string, digit: number): string => target.padStart(digit, padStr)

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
 * 指定した値の簡易ハッシュコードを生成して返す
 *
 * @param target ハッシュコードを算出する値
 * @returns 値のハッシュコード
 */
export const hashCode = (target: unknown): number => {
  let hash = 0
  if (!isNullish(target)) {
    const valStr = JSON.stringify(target)
    for (let i = 0; i < valStr.length; i++) {
      hash = hash * 31 + valStr.charCodeAt(i)
      hash = hash | 0
    }
  }
  return hash
}

/**
 * FileをBase64エンコードし、DataURL文字列に変換する
 *
 * @param file - 変換するFileオブジェクト
 * @returns 処理成功時ファイルのデータを表すDataURL文字列で解決されるPromiseオブジェクト
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * 画像ファイル(jpeg, png)を圧縮する
 *
 * @param image - 圧縮する画像ファイル
 * @param maxSizeMB - 圧縮後の最大サイズ
 * @returns 圧縮済みのファイルで解決されるPromiseオブジェクト
 */
export const imageCompression = (image: File, maxSizeMB = 2): Promise<File> =>
  browserImageCompression(image, { maxSizeMB })

/**
 * 指定ファイル名の拡張子が第2引数以降の値に含まれているか否かを示す真偽値を返す
 *
 * @param filename - 判定対象のファイル名
 * @param exts - 検索先となる値
 * @returns ファイル名の拡張子が第2引数以降の値に含まれているか否かを示す真偽値
 */
export const isExtIncluded = (filename: string | undefined, ...exts: readonly string[]): boolean => {
  if (isNullish(filename)) return false
  const pos = filename.lastIndexOf('.')
  const ext = pos === -1 ? '' : filename.slice(pos + 1).toLowerCase()
  return includes(ext, ...exts)
}

/**
 * 指定誕生年月日の満年齢を返す
 *
 * @param year - 誕生年
 * @param month - 誕生月
 * @param date - 誕生日
 * @returns 年齢を示すNumber
 */
export const age = (year: string | number, month: string | number, date: string | number): number => {
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
