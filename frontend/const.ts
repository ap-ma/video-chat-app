//  ----------------------------------------------------------------------------
//  system const values
//  ----------------------------------------------------------------------------

/** システム アプリ名 */
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME
/** システム デフォルトロケール */
export const LOCALE = process.env.NEXT_PUBLIC_LOCALE as 'ja' | 'en'
/** システム モード */
export const APP_MODE = process.env.NODE_ENV
/** システム APIルートURL */
export const API_URL = process.env.NEXT_PUBLIC_API_URL

//  ----------------------------------------------------------------------------
//  general const values
//  ----------------------------------------------------------------------------

/** 日付 デフォルトフォーマット */
export const DATE_FORMAT = 'PP'
