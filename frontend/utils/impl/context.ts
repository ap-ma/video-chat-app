import { APP_MODE } from 'const'

/**
 * Node.js環境か否かを示す真偽値を返す
 *
 * @returns Node.js環境かを示す真偽値
 */
export const isNode = (): boolean => !isBrowser()

/**
 * ブラウザ環境か否かを示す真偽値を返す
 *
 * @returns ブラウザ環境かを示す真偽値
 */
export const isBrowser = (): boolean => typeof window !== 'undefined'

/**
 * 開発環境か否かを示す真偽値を返す
 *
 * @returns 開発環境かを示す真偽値
 */
export const isDevelopment = (): boolean => !isProduction()

/**
 * 本番環境か否かを示す真偽値を返す
 *
 * @returns 本番環境かを示す真偽値
 */
export const isProduction = (): boolean => APP_MODE === 'production'
