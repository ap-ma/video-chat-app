import { makeVar } from '@apollo/client'

const _localStorage =
  typeof localStorage !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => undefined }

/** contact info user id storage key */
const CONTACT_INFO_USER_ID_KEY = '__contactInfoUserId'

/** Local State Set ContactInfoUserId */
export type SetContactInfoUserId = typeof setContactInfoUserId

/** コンタクト情報 選択ユーザーID */
export const contactInfoUserIdVar = makeVar(_localStorage.getItem(CONTACT_INFO_USER_ID_KEY))

/**
 * コンタクト情報の選択状態ユーザーIDをリアクティブ変数およびlocalStorageに保持する
 *
 * @param userId コンタクト情報ユーザーID
 */
export const setContactInfoUserId = (userId: string): void => {
  _localStorage.setItem(CONTACT_INFO_USER_ID_KEY, userId)
  contactInfoUserIdVar(userId)
}
