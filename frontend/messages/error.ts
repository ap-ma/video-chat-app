// prettier-ignore

export const VALIDATION_ERROR = {
  // 最大長
  V_MAX_LENGTH: '{name} must be no more than {length} characters.',
  // 認証失敗
  V_AUTH_FAILED: 'Incorrect Email address or Password.',
  // パスワード形式
  V_PASS_FORMAT: 'Password must be {min} to {max} alphanumeric characters long, including at least one uppercase letter, one lowercase letter, and one number.',
  // パスワード確認不一致
  V_PASS_CONFIRMATION_NOT_MATCH: 'Password confirmation does not match password.',
  // パスワード誤り
  V_PASS_INCORRECT: 'Password is incorrect.',
  // メール形式
  V_EMAIL_FORMAT: 'Email address format is invalid.',
  // メール重複
  V_EMAIL_DUPLICATION: 'This email address is already registered.',
  // メール変更なし
  V_EMAIL_NO_CHANGE: 'There is no change to your registration.',
  // コード形式
  V_CODE_FORMAT: 'Code must be between {min} and {max} alphanumeric characters.',
  // コード重複
  V_CODE_DUPLICATION: 'Code is already registered.',
  // トークン未入力
  V_TOKEN_NOT_ENTERED: 'No token entered.',
  // トークン不正
  V_TOKEN_INVALID: 'Invalid token.',
  // トークン期限切れ
  V_TOKEN_EXPIRED: 'Token has expired.',
  // トークン不一致
  V_TOKEN_NOT_MATCH: 'Token does not match.',
  // コンタクトID不正
  V_CONTACT_ID_INVALID: 'Invalid contact id.',
  // コンタクト登録済
  V_CONTACT_REGISTERED: 'Contact is already registered.',
  // コンタクト削除済
  V_CONTACT_DELETED: 'Contact has been deleted.',
  // コンタクト未削除
  V_CONTACT_NOT_DELETED: 'Contacts have not been deleted.',
  // コンタクトブロック済
  V_CONTACT_BLOCKED: 'Cntact is blocked.',
  // コンタクト未ブロック
  V_CONTACT_NOT_BLOCKED: 'Contact is not blocked.',
  // メッセージID不正
  V_MESSAGE_ID_INVALID: 'Invalid message id.',
  // メッセージ削除済
  V_MESSAGE_DELETED: 'Message has already been deleted.',
  // メッセージがコンタクト申請でない
  V_MESSAGE_NOT_APPLICATION: 'Message is not a contact application message.'
}
