import { Unbox } from 'types'

/**
 * 値が配列か否かを示す真偽値を返す
 *
 * @param argment - 判定対象の値
 * @returns 配列か否かを示す真偽値
 */
export const isArray = (argment: unknown): argment is unknown[] => Array.isArray(argment)

/**
 * 値がオブジェクトか否かを示す真偽値を返す
 *
 * @param argment - 判定対象の値
 * @returns 配列か否かを示す真偽値
 */
export const isObject = (argment: unknown): argment is Record<string, unknown> =>
  argment !== null && !isArray(argment) && typeof argment === 'object'

/**
 * ReactNodeオブジェクトがReactElementか否かを示す真偽値を返す
 *
 * @param reactNode - 判定対象のReactNodeオブジェクト
 * @returns ReactElementか否かを示す真偽値
 */
export const isReactElement = (reactNode: React.ReactNode): reactNode is React.ReactElement =>
  !isNullish(reactNode) && !isArray(reactNode) && typeof reactNode === 'object'

/**
 * 値がnullまたはundefinedか否かを示す真偽値を返す
 *
 * @param argment - 判定対象の値
 * @returns nullまたはundefinedか否かを示す真偽値
 */
export const isNullish = (argment: unknown): argment is null | undefined => {
  if (typeof argment === 'undefined') return true
  if (argment === null) return true
  return false
}

/**
 * 値がブランクか否かを示す真偽値を返す
 *
 * @param argment - 判定対象の値
 * @returns ブランクか否かを示す真偽値
 */
export const isBlank = (argment: unknown): boolean => {
  if (isNullish(argment)) return true
  if (typeof argment === 'string' || isArray(argment)) return argment.length === 0
  if (isObject(argment)) return Object.keys(argment).length === 0
  return false
}

/**
 * 配列の要素にブランクとして評価される値が含まれるか否かを示す真偽値を返す
 *
 * @param argments - 判定対象の配列
 * @returns ブランクを含むか否かを示す真偽値
 */
export const includesBlank = (...argments: unknown[]): boolean => {
  for (const argment of argments) if (isBlank(argment)) return true
  return false
}

/**
 * 指定された値が値を持つか否かを示す真偽値を返す
 *
 * @param argment - 判定対象の値
 * @returns 値を持つか否かを示す真偽値
 */
export const hasValue = (argment: unknown): boolean => {
  if (isArray(argment)) {
    for (const elem of argment) if (hasValue(elem)) return true
    return false
  }
  if (isObject(argment)) {
    for (const value of Object.values(argment)) if (hasValue(value)) return true
    return false
  }
  return !isBlank(argment)
}

/**
 * 値が第2引数以降の値に含まれているか否かを示す真偽値を返す
 *
 * @param valueToFind - 検索する値
 * @param targetArray - 検索先となる値
 * @returns 含まれているか否かを示す真偽値
 */
export const includes = (valueToFind: unknown, ...targetArray: unknown[]): boolean =>
  targetArray.includes(valueToFind)

/**
 * 値が指定キーのプロパティを持つか否かを示す真偽値を返す
 *
 * @param target - 判定対象の値
 * @param key - 検索するプロパティ名
 * @returns プロパティを持つか否かを示す真偽値
 */
export const hasProperty = (target: unknown, key: string): key is keyof typeof target =>
  isObject(target) && key in target

/**
 * 配列にArray.prototype.spliceが実施された状態の新規配列を返す
 *
 * @param array - コピー元配列
 * @param start - 配列を変更する開始位置
 * @param deleteCount - 配列から取り除く要素数
 * @param item - 配列に新規で追加する要素
 * @returns コピー元配列にArray.prototype.spliceが実施された状態の配列
 */
export const splice = <T>(array: T[], start: number, deleteCount: number, ...item: T[]): T[] => {
  const copyArray = [...array]
  copyArray.splice(start, deleteCount, ...item)
  return copyArray
}

/**
 * オブジェクトの指定プロパティが指定の値に変更された状態の新規オブジェクトを返す
 *
 * @param object - コピー元オブジェクト
 * @param property - 値を変更するプロパティ
 * @param value - 変更する値
 * @returns コピー元オブジェクトの指定プロパティが指定の値に変更された状態のオブジェクト
 */
export const breedObject = <T extends Record<string, unknown>>(
  object: T,
  property: keyof T,
  value: Unbox<T>
): T => ({
  ...object,
  [property]: value
})

/**
 * 配列の指定要素の指定プロパティが指定の値に変更された状態の新規配列を返す
 *
 * @param array - コピー元配列
 * @param index - 変更する要素のインデックス
 * @param property - 値を変更するプロパティ
 * @param value - 変更する値
 * @returns コピー元配列の指定要素の指定プロパティが指定の値に変更された状態の配列
 */
export const breedArray = <T extends Record<string, unknown>>(
  array: T[],
  index: number,
  property: keyof T,
  value: Unbox<T>
): T[] => {
  const element = array[index]
  if (isNullish(element)) throw new RangeError('Index out of bounds of array.')
  return splice(array, index, 1, breedObject(element, property, value))
}

/**
 * 指定された値をJSONを使用して簡易的にディープコピーしたオブジェクトを返す
 * JSONでシリアライズができない値は破棄され、DateはUTCとなる
 *
 * @param argment - コピー元配列
 * @returns JSONを用いてコピーしたオブジェクト
 */
export const deepCopy = <T>(argment: T): T => JSON.parse(JSON.stringify(argment)) as T
