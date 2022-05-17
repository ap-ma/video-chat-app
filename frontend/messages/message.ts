import { CALL, MESSAGE } from 'const'

export const CATEGORY_MESSAGE = {
  // コンタクト申請
  [MESSAGE.CATEGORY.CONTACT_APPLICATION]: '{tx_user} applied for the contact.',
  // コンタクト承認
  [MESSAGE.CATEGORY.CONTACT_APPROVAL]: '{other_user} has been added to the contacts.',
  // 画像送信
  [MESSAGE.CATEGORY.IMAGE_TRANSMISSION]: '{tx_user} sent the image.',
  // 通話
  [MESSAGE.CATEGORY.CALLING]: {
    // 呼出
    [CALL.STATUS.OFFER]: 'Calling: Ringing up',
    // 通話中
    [CALL.STATUS.DURING]: 'Calling: During',
    // 通話終了
    [CALL.STATUS.ENDED]: 'Calling: Ended',
    // キャンセル
    [CALL.STATUS.CANCELED]: 'Calling: Canceled'
  } as const
}
