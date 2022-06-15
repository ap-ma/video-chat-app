import { Avatar, AvatarProps, Flex, FlexProps, Text, useDisclosure } from '@chakra-ui/react'
import Balloon from 'components/01_atoms/Balloon'
import DeleteMessageConfirmDialog from 'components/04_organisms/_dialogs/DeleteMessageConfirmDialog'
import { connect } from 'components/hoc'
import { MESSAGE } from 'const'
import { ContactInfoQuery, DeleteMessageMutation, DeleteMessageMutationVariables, MeQuery } from 'graphql/generated'
import React, { Fragment } from 'react'
import { ContainerProps, Disclosure, MutaionLoading, MutaionReset, MutateFunction, Unbox } from 'types'
import { toStr } from 'utils/general/helper'
import { isNullish } from 'utils/general/object'
import { getMessage } from 'utils/helper'
import * as styles from './styles'

/** Message Props */
export type MessageProps = FlexProps & {
  /**
   *  メッセージ
   */
  message: Unbox<ContactInfoQuery['contactInfo']['chat']>
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
  /**
   * Mutation
   */
  mutation: {
    /**
     * メッセージ削除
     */
    deleteMessage: {
      result?: DeleteMessageMutation['deleteMessage']
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<MessageProps, 'query'> & {
  isSender: boolean
  avatar: AvatarProps['src']
  content: string
  isRead: boolean
  time: string
  dmcdDisc: Disclosure
}

/** Presenter Component */
const MessagePresenter: React.VFC<PresenterProps> = ({
  message,
  mutation: { deleteMessage },
  isSender,
  avatar,
  content,
  isRead,
  time,
  dmcdDisc,
  ...props
}) => (
  <Fragment>
    <Flex {...styles.root({ isSender })} {...props}>
      <Flex {...styles.container({ isSender })}>
        <Avatar src={avatar} />
        <Flex {...styles.content({ isSender })}>
          <Balloon {...styles.balloon({ isSender })}>
            <Text {...styles.textContent({ isSender })}>{content}</Text>
          </Balloon>
        </Flex>
        <Flex {...styles.info({ isSender })}>
          <Text {...styles.read({ isRead })}>Read</Text>
          <Text {...styles.infoText}>{time}</Text>
        </Flex>
      </Flex>
    </Flex>
    <DeleteMessageConfirmDialog
      message={message}
      mutation={{ deleteMessage }}
      isOpen={dmcdDisc.isOpen}
      onClose={dmcdDisc.onClose}
    />
  </Fragment>
)

/** Container Component */
const MessageContainer: React.VFC<ContainerProps<MessageProps, PresenterProps>> = ({
  presenter,
  message,
  query: { me, contactInfo },
  mutation: { deleteMessage },
  ...props
}) => {
  const isSender = message.txUserId === me.result?.id
  const avatar = (isSender ? me.result?.avatar : contactInfo.result?.userAvatar) ?? undefined
  const content = !isNullish(contactInfo.result) ? getMessage(message, contactInfo.result, toStr(me.result?.name)) : ''
  const isRead = MESSAGE.STATUS.READ === message.status
  const time = message.createdAt.substring(11, 16)

  // DeleteMessageConfirmDialog modal
  const dmcdDisc = useDisclosure()

  return presenter({
    message,
    mutation: { deleteMessage },
    isSender,
    avatar,
    content,
    isRead,
    time,
    dmcdDisc,
    ...props
  })
}

/** Message */
export default connect<MessageProps, PresenterProps>('Message', MessagePresenter, MessageContainer)
