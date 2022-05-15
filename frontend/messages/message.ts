import { CALL, MESSAGE } from 'const'

export const CATEGORY_MESSAGE = {
  // コンタクト申請
  [MESSAGE.CATEGORY.CONTACT_APPLICATION]: '{tx_user} applied for the contact.',
  // コンタクト承認
  [MESSAGE.CATEGORY.CONTACT_APPROVAL]: '{tx_user} approved the contact.',
  // 画像送信
  [MESSAGE.CATEGORY.IMAGE_TRANSMISSION]: '{tx_user} sent the image.',
  // 通話
  [MESSAGE.CATEGORY.CALLING]: {
    // 呼出
    [CALL.STATUS.OFFER]: '{tx_user} placed the call.',
    // 通話中
    [CALL.STATUS.DURING]: 'Calling.',
    // 通話終了
    [CALL.STATUS.TERMINATED]: 'Call terminated.',
    // キャンセル
    [CALL.STATUS.CANCELED]: '{tx_user} canceled the call.'
  } as const
}
