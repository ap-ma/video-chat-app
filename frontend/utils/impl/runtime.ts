/**
 * Node.js環境かを示す真偽値を返す
 *
 * @returns Node.js環境かを示す真偽値
 */
export const isNode = (): boolean => !isBrowser()

/**
 * ブラウザ環境かを示す真偽値を返す
 *
 * @returns ブラウザ環境かを示す真偽値
 */
export const isBrowser = (): boolean => typeof window !== 'undefined'
