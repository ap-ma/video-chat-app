import { isDevelopment, isNode } from 'utils'

//  ----------------------------------------------------------------------------
//  system const values
//  ----------------------------------------------------------------------------

/** システム アプリ名 */
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME

/** システム デフォルトロケール */
export const LOCALE = process.env.NEXT_PUBLIC_LOCALE as 'ja' | 'en'

/** システム モード */
export const APP_MODE = process.env.NODE_ENV

/** システム APP URL */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL

/** システム API URL */
export const API_URL =
  isNode() && isDevelopment()
    ? process.env.NEXT_PUBLIC_API_URL?.replace('localhost', 'rust')
    : process.env.NEXT_PUBLIC_API_URL

//  ----------------------------------------------------------------------------
//  page path const values
//  ----------------------------------------------------------------------------

/** ページ index */
export const INDEX_PAGE = '/'

/** ページ signin */
export const SIGNIN_PAGE = '/signin'

/** ページ error */
export const ERROR_PAGE = '/error'

//  ----------------------------------------------------------------------------
//  general const values
//  ----------------------------------------------------------------------------

/** 日付 デフォルトフォーマット */
export const DATE_FORMAT = 'PP'

/** チャット フェッチ件数 */
export const CHAT_LENGTH = 50
