import { makeVar } from '@apollo/client'

/** Local State ContactInfoUserId */
export type ContactInfoUserId = string | undefined

/** Local State Set ContactInfoUserId */
export type SetContactInfoUserId = typeof setContactInfoUserId

/** コンタクト情報 選択ユーザーID */
export const contactInfoUserIdVar = makeVar<ContactInfoUserId>(undefined)

/**
 * コンタクト情報の選択状態ユーザーIDをリアクティブ変数に保持する
 *
 * @param userId コンタクト情報ユーザーID
 */
export const setContactInfoUserId = (userId: string): void => {
  contactInfoUserIdVar(userId)
}
