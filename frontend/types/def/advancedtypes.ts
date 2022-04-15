/* eslint-disable @typescript-eslint/no-explicit-any */

//  ----------------------------------------------------------------------------
//  Utility Types
//  ----------------------------------------------------------------------------

/**
 * 型引数に指定された型によってそれぞれ以下を返却
 * @オブジェクト型 オブジェクトのプロパティの型をUnion型で返却
 * @配列型 配列の要素の型を返却
 */
export type Unbox<T> = T extends { [k: string]: infer U } ? U : T extends (infer U)[] ? U : T

/**
 * 型引数に指定された型によってそれぞれ以下を返却
 * @配列型 配列の要素型を返却
 * @関数型 関数の戻り型を返却
 * @Promise型 resolve引数型を返却
 */
export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T

/** 型引数に指定された型が配列型もしくはオブジェクト型の場合neverを返却し、それ以外の場合指定した型をそのまま返却 */
export type Primitive<T> = T extends Unbox<T> ? T : never

/** 型引数に指定されたUnion型をIntersection型に変換して返却 */
type _UTI<T> = T extends any ? (args: T) => void : never
export type UnionToIntersection<T> = _UTI<T> extends (args: infer I) => void ? I : never

/** 型引数に指定した型の要素を1つ以上持つ配列を返却 */
export type NonEmptyList<T> = [T, ...T[]]

/** 型引数に指定したSet型の要素の型を返却 */
export type PickSet<T> = T extends Set<infer I> ? I : never

/** 型引数に指定したMap型のキーの型を返却 */
export type PickMapKey<T> = T extends Map<infer K, any> ? K : never

/** 型引数に指定されたオブジェクト型から関数型のプロパティを抽出し、その戻り値型を返却 */
export type ReturnTypes<T> = {
  [K in keyof T]: T[K] extends (...args: any) => unknown ? ReturnType<T[K]> : never
}

/** 型引数に指定されたオブジェクト型から関数型のプロパティを抽出し、そのプロパティ名を返却 */
export type FunctionPropertyName<T> = {
  [K in keyof T]: T[K] extends (...args: any) => unknown ? K : never
}[keyof T]

/** 型引数に指定されたオブジェクト型から関数型のプロパティのみを抽出して返却 */
export type FunctionProperties<T> = Pick<T, FunctionPropertyName<T>>

/** 型引数に指定されたオブジェクト型から関数型以外のプロパティを抽出し、そのプロパティ名を返却 */
export type NonFunctionPropertyName<T> = {
  [K in keyof T]: T[K] extends (...args: any) => unknown ? never : K
}[keyof T]

/** 型引数に指定されたオブジェクト型から関数型以外のプロパティを抽出して返却 */
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyName<T>>

/** 型引数に指定されたオブジェクトの指定プロパティに対し、Partial変換を行い返却 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** 型引数に指定されたオブジェクトの指定プロパティに対し、Required変換を行い返却 */
export type NonOptional<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/** 型引数に指定されたオブジェクト型のプロパティに対し、再帰的にReadonly変換を行い返却 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Primitive<T[P]> ? T[P] : DeepReadonly<T[P]>
}

/** 型引数に指定されたオブジェクト型のプロパティに対し、再帰的にRequired変換を行い返却 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends Primitive<T[P]> ? T[P] : DeepRequired<T[P]>
}

/** 型引数に指定されたオブジェクト型のプロパティに対し、再帰的にPartial変換を行い返却 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Primitive<T[P]> ? T[P] : DeepPartial<T[P]>
}

/** 型引数に指定されたオブジェクト型のプロパティに対し、再帰的にNullable変換を行い返却 */
export type DeepNullable<T> = {
  [P in keyof T]?: T[P] extends Primitive<T[P]> ? T[P] | null : DeepNullable<T[P]>
}

/** 型引数に指定されたオブジェクト型のプロパティに対し、再帰的にNonNullable変換を行い返却 */
export type DeepNonNullable<T> = {
  [P in keyof T]-?: T[P] extends Primitive<T[P]>
    ? Exclude<T[P], null | undefined>
    : DeepNullable<T[P]>
}
