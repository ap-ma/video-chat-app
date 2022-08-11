import { APP_MODE } from 'const'

/**
 * ブラウザ環境か否かを示す真偽値を返す
 *
 * @returns ブラウザ環境かを示す真偽値
 */
export const isBrowser = (): boolean => typeof window !== 'undefined'

/**
 * Node.js環境か否かを示す真偽値を返す
 *
 * @returns Node.js環境かを示す真偽値
 */
export const isNode = (): boolean => !isBrowser()

/**
 * 本番環境か否かを示す真偽値を返す
 *
 * @returns 本番環境かを示す真偽値
 */
export const isProduction = (): boolean => APP_MODE === 'production'

/**
 * 開発環境か否かを示す真偽値を返す
 *
 * @returns 開発環境かを示す真偽値
 */
export const isDevelopment = (): boolean => !isProduction()
