import { DATE_FORMAT, LOCALE } from 'const'
/* eslint-disable import/no-duplicates */
import { format, fromUnixTime, parse } from 'date-fns'
import { enUS, ja } from 'date-fns/locale'
/* eslint-enable import/no-duplicates */

/** locale mapping */
const localeMap = { ja, en: enUS }
/** locale mapping keys */
type LocaleMapKey = keyof typeof localeMap

/**
 * 指定されたフォーマットで整形された日付文字列を返す
 *
 * @param date - フォーマット元Dateオブジェクト
 * @param formatStr - フォーマット文字列
 * @param locale - ロケール文字列
 * @returns フォーマットされた日付文字列
 */
export const dateFormat = (date: Date, formatStr: string = DATE_FORMAT, locale: LocaleMapKey = LOCALE): string =>
  format(date, formatStr, {
    locale: localeMap[locale]
  })

/**
 * 与えられたフォーマット文字列を用いて文字列から解析されたDateオブジェクトを返す
 *
 * @param dateStr - 解析する日付文字列
 * @param formatStr - フォーマット文字列
 * @param referenceDate - 解析された日付文字列に欠けている値を保管するDateオブジェクト
 * @param locale - ロケール文字列
 * @returns 解析されたDateオブジェクト
 */
export const parseDate = (
  dateStr: string,
  formatStr: string = DATE_FORMAT,
  referenceDate: Date = new Date(),
  locale: LocaleMapKey = LOCALE
): Date =>
  parse(dateStr, formatStr, referenceDate, {
    locale: localeMap[locale]
  })

/**
 * 与えられたUnixのタイムスタンプを表すDateオブジェクトを返す
 *
 * @param unixTime - Unixタイムスタンプ
 * @returns 作成されたDateオブジェクト
 */
export const unixTimeToDate = (unixTime: number): Date => fromUnixTime(unixTime)
