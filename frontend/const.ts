import { isDevelopment, isNode } from 'utils'

//  ----------------------------------------------------------------------------
//  System const values
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
export const API_URL = (
  isNode() && isDevelopment()
    ? process.env.NEXT_PUBLIC_API_URL?.replace('localhost', 'rust')
    : process.env.NEXT_PUBLIC_API_URL
) as string

/** システム API WebSocket URL */
export const API_WS_URL = process.env.NEXT_PUBLIC_API_WS_URL as string

//  ----------------------------------------------------------------------------
//  API Error type
//  ----------------------------------------------------------------------------

/** API Error type */
export const API_ERROR_TYPE = {
  /** InternalServerError */
  INTERNAL_SERVER_ERROR: 'InternalServerError',
  /** AuthenticationError */
  AUTHENTICATION_ERROR: 'AuthenticationError',
  /** AuthorizationError */
  AUTHORIZATION_ERROR: 'AuthorizationError',
  /** ValidationError */
  VALIDATION_ERROR: 'ValidationError'
} as const

//  ----------------------------------------------------------------------------
//  Page path const values
//  ----------------------------------------------------------------------------

/** ページ index */
export const INDEX_PAGE = '/'

/** ページ signin */
export const SIGNIN_PAGE = '/signin'

/** ページ error */
export const ERROR_PAGE = '/error'

//  ----------------------------------------------------------------------------
//  General const values
//  ----------------------------------------------------------------------------

/** Dateオブジェクト 文字列表現デフォルトフォーマット */
export const DATE_FORMAT = 'PP'

/** チャット フェッチ件数 */
export const CHAT_LENGTH = 50

//  ----------------------------------------------------------------------------
//  App const values
//  ----------------------------------------------------------------------------

/** App const USER */
export const USER = {
  /** 権限 */
  ROLE: {
    /** 管理者 */
    ADMIN: 1,
    /** ユーザー */
    USER: 2
  },
  /** ステータス */
  STATUS: {
    /** 活性 */
    ACTIVE: 1,
    /** 削除済 */
    DELETED: 2,
    /** メールアドレス未承認 */
    UNAPPROVED: 3
  }
} as const

/** App const CONTACT */
export const CONTACT = {
  /** ステータス */
  STATUS: {
    /** 未承認 */
    UNAPPROVED: 1,
    /** 承認済み */
    APPROVED: 2,
    /** 削除済み */
    DELETED: 3
  }
} as const

/** App const MESSAGE */
export const MESSAGE = {
  /** 分類 */
  CATEGORY: {
    /** コンタクト申請 */
    CONTACT_APPLICATION: 1,
    /** コンタクト承認 */
    CONTACT_APPROVAL: 2,
    /** メッセージ */
    MESSAGE: 3,
    /** 通話 */
    CALLING: 4,
    /** ファイル送信 */
    FILE_TRANSMISSION: 5
  },
  /** ステータス */
  STATUS: {
    /** 未読 */
    UNREAD: 1,
    /** 既読 */
    READ: 2,
    /** 削除済 */
    DELETED: 3
  }
} as const
