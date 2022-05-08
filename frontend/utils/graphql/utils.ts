import { MESSAGE } from 'const'
import { MessageChanged, MutationType } from 'graphql/generated'

/**
 * 指定のMessageChangedオブジェクトがコンタクト承認のものか否かを示す真偽値を返す
 *
 * @param messageChanged - 判定対象のMessageChanged
 * @returns コンタクト承認のものか否かを示す真偽値
 */
export const isContactApproval = (messageChanged: MessageChanged): boolean =>
  MutationType.Created === messageChanged.mutationType &&
  MESSAGE.CATEGORY.CONTACT_APPROVAL === messageChanged.message?.category
