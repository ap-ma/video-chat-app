import { isDevelopment, isNode } from 'utils/general/context'

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
//  Validation const value
//  ----------------------------------------------------------------------------

/** Validation comment 最大長 */
export const VALIDATION_USER_COMMENT_MAX_LEN = 50

/** Validation code パターン 最低4文字 最大8文字 半角英数字 */
export const VALIDATION_CODE_PATTERN = /^[a-zA-Z0-9]{4,8}$/

/** Validation password パターン 最低8文字 最大24文字 大文字、小文字、数字をそれぞれ1文字以上含む半角英数字 */
export const VALIDATION_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,24}$/

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

/** Email検証リンク 有効期限(分) */
export const EMAIL_VERIFICATION_LINK_EXPIRATION_MINUTES = 30

/** パスワードリセットリンク 有効期限(分) */
export const PASSWORD_RESET_LINK_EXPIRATION_MINUTES = 30

/** 画像ファイルとして許可するファイル拡張子 */
export const ALLOWED_IMAGE_EXTS = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png']

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
    /** メールアドレス未検証 */
    UNVERIFIED: 3
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
    /** 画像送信 */
    IMAGE_TRANSMISSION: 4,
    /** 通話 */
    CALLING: 5
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

/** App const CALL */
export const CALL = {
  /** ステータス */
  STATUS: {
    /** 呼出 */
    OFFER: 1,
    /** 通話中 */
    DURING: 2,
    /** 通話終了 */
    ENDED: 3,
    /** キャンセル */
    CANCELED: 4
  }
} as const

/** App const EMAIL_VERIFICATION_TOKEN */
export const EMAIL_VERIFICATION_TOKEN = {
  /** 分類 */
  CATEGORY: {
    /** 作成 */
    CREATE: 1,
    /** 更新 */
    UPDATE: 2
  }
} as const
