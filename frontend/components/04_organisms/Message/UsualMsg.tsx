import { Box, HStack, Icon, Image, ImageProps, Text } from '@chakra-ui/react'
import MessageShowcase, { MessageShowcaseProps } from 'components/03_molecules/MessageShowcase'
import { connect } from 'components/hoc'
import { MESSAGE } from 'const'
import { ContactInfoQuery, MeQuery } from 'graphql/generated'
import React, { ReactText } from 'react'
import { AiFillPhone } from 'react-icons/ai'
import { ContainerProps, DeleteMessageId, OnOpen, SetState, Unbox } from 'types'
import { toStr } from 'utils/general/helper'
import { isNullish } from 'utils/general/object'
import { getMessage } from 'utils/helper'
import * as styles from './styles'

/** UsualMsg Props */
export type UsualMsgProps = Omit<
  MessageShowcaseProps,
  'children' | 'messagePosition' | 'avatar' | 'isRead' | 'time' | 'onBalloonClick'
> & {
  /**
   *  メッセージ
   */
  message?: Unbox<ContactInfoQuery['contactInfo']['chat']>
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
export type PresenterProps = Omit<UsualMsgProps, 'message' | 'onDmcdOpen' | 'setDeleteMessageId' | 'query'> & {
  isText: boolean
  isImage: boolean
  isCall: boolean
  isSender: boolean
  text?: ReactText
  imageSrc: ImageProps['src']
  callInfo?: ReactText
  avatar: MessageShowcaseProps['avatar']
  isRead: MessageShowcaseProps['isRead']
  time: MessageShowcaseProps['time']
  onBalloonClick: MessageShowcaseProps['onBalloonClick']
}

/** Presenter Component */
const UsualMsgPresenter: React.VFC<PresenterProps> = ({
  isText,
  isImage,
  isCall,
  isSender,
  text,
  imageSrc,
  callInfo,
  avatar,
  isRead,
  time,
  onBalloonClick,
  ...props
}) => (
  <MessageShowcase {...styles.showcase({ isSender, isImage })} {...{ avatar, isRead, time, onBalloonClick }} {...props}>
    <Text {...styles.textMsg({ isText, isSender })}>{text}</Text>
    <Box {...styles.imageMsg({ isImage })}>
      <Image src={imageSrc} {...styles.image} />
    </Box>
    <HStack {...styles.callMsg({ isCall })}>
      <Icon as={AiFillPhone} boxSize={7} />
      <Text {...styles.callInfo}>{callInfo}</Text>
    </HStack>
  </MessageShowcase>
)

/** Container Component */
const UsualMsgContainer: React.VFC<ContainerProps<UsualMsgProps, PresenterProps>> = ({
  presenter,
  message,
  onDmcdOpen,
  setDeleteMessageId,
  query: { me, contactInfo },
  ...props
}) => {
  const isText = MESSAGE.CATEGORY.MESSAGE === message?.category
  const isImage = MESSAGE.CATEGORY.IMAGE_TRANSMISSION === message?.category
  const isCall = MESSAGE.CATEGORY.CALLING === message?.category

  const text = isText ? message?.message ?? '' : undefined
  const imageSrc = isImage ? message?.message ?? '' : undefined
  const callInfo =
    isCall && !isNullish(message) && !isNullish(contactInfo.result)
      ? getMessage(message, contactInfo.result, toStr(me.result?.name))
      : undefined

  const isSender = message?.txUserId === me.result?.id
  const avatar = (isSender ? me.result?.avatar : contactInfo.result?.userAvatar) ?? undefined
  const isRead = message?.txUserId === me.result?.id && MESSAGE.STATUS.READ === message?.status
  const time = message?.createdAt.substring(11, 16) ?? ''

  const onBalloonClick = () => {
    if (!isSender) return
    setDeleteMessageId(message?.id)
    onDmcdOpen()
  }

  return presenter({
    isText,
    isImage,
    isCall,
    isSender,
    text,
    imageSrc,
    callInfo,
    avatar,
    isRead,
    time,
    onBalloonClick,
    ...props
  })
}

/** UsualMsg */
export default connect<UsualMsgProps, PresenterProps>('UsualMsg', UsualMsgPresenter, UsualMsgContainer)
