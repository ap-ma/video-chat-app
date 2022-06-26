import { Box, BoxProps } from '@chakra-ui/react'
import Balloon from 'components/01_atoms/Balloon'
import { connect } from 'components/hoc'
import { MESSAGE } from 'const'
import { ContactInfoQuery, MeQuery } from 'graphql/generated'
import React, { ReactText } from 'react'
import { ContainerProps, DeleteMessageId, OnOpen, SetState, Unbox } from 'types'
import { toStr } from 'utils/general/helper'
import { includes, isNullish, isString } from 'utils/general/object'
import { getMessage } from 'utils/helper'
import * as styles from './styles'
import UsualMsg from './UsualMsg'

/** Message Props */
export type MessageProps = BoxProps & {
  /**
   *  メッセージ
   */
  message: string | Unbox<ContactInfoQuery['contactInfo']['chat']>
  /**
   * メッセージ削除ダイアログ onOpen
   */
  onDmcdOpen: OnOpen
  /**
   * メッセージ削除 IDセット関数
   */
  setDeleteMessageId: SetState<DeleteMessageId>
  /**
   * Query
   */
  query: {
    /**
     * ユーザー情報
     */
    me: {
      result?: MeQuery['me']
    }
    /**
     *  コンタクト情報
     */
    contactInfo: {
      result?: ContactInfoQuery['contactInfo']
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<MessageProps, 'message'> & {
  isDate: boolean
  isMessage: boolean
  isWorkflow: boolean
  message?: Unbox<ContactInfoQuery['contactInfo']['chat']>
  text?: ReactText
}

/** Presenter Component */
const MessagePresenter: React.VFC<PresenterProps> = ({
  message,
  onDmcdOpen,
  setDeleteMessageId,
  query,
  isDate,
  isMessage,
  isWorkflow,
  text,
  ...props
}) => (
  <Box {...styles.root} {...props}>
    <Box {...styles.date({ isDate })}>{text}</Box>
    <Balloon {...styles.workflow({ isWorkflow })}>{text}</Balloon>
    <UsualMsg {...styles.usualMsg({ isMessage })} {...{ message, onDmcdOpen, setDeleteMessageId, query }} />
  </Box>
)

/** Container Component */
const MessageContainer: React.VFC<ContainerProps<MessageProps, PresenterProps>> = ({
  presenter,
  message: msg,
  query: { me, contactInfo },
  ...props
}) => {
  const workflow = [MESSAGE.CATEGORY.CONTACT_APPLICATION, MESSAGE.CATEGORY.CONTACT_APPROVAL]
  const isDate = isString(msg)
  const isWorkflow = !isDate && includes(msg.category, ...workflow)
  const isMessage = !isDate && !isWorkflow

  const message = isMessage ? msg : undefined
  const text = isDate
    ? msg
    : !isNullish(contactInfo.result)
    ? getMessage(msg, contactInfo.result, toStr(me.result?.name))
    : undefined

  return presenter({
    query: { me, contactInfo },
    isDate,
    isMessage,
    isWorkflow,
    message,
    text,
    ...props
  })
}

/** Message */
export default connect<MessageProps, PresenterProps>('Message', MessagePresenter, MessageContainer)
