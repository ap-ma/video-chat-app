import { Avatar, AvatarProps, Flex, FlexProps, Text } from '@chakra-ui/react'
import Balloon, { BalloonProps } from 'components/01_atoms/Balloon'
import { connect } from 'components/hoc'
import React, { ReactText } from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'

/** MessageShowcase Props */
export type MessageShowcaseProps = WithChildren &
  Omit<FlexProps, 'children'> & {
    /**
     * メッセージの位置
     */
    messagePosition: 'left' | 'right'
    /**
     * アバター画像URL
     */
    avatar: AvatarProps['src']
    /**
     * 既読フラグ
     */
    isRead: boolean
    /**
     * 送信時刻
     */
    time: ReactText
    /**
     * Balloon Props
     */
    balloon?: Omit<BalloonProps, 'tailPosition' | 'onClick'>
    /**
     * Balloon onClick
     */
    onBalloonClick?: BalloonProps['onClick']
  }

/** Presenter Props */
export type PresenterProps = Omit<MessageShowcaseProps, 'messagePosition'> & {
  isLeftAligned: boolean
}

/** Presenter Component */
const MessageShowcasePresenter: React.VFC<PresenterProps> = ({
  isLeftAligned,
  avatar,
  isRead,
  time,
  balloon,
  onBalloonClick,
  children,
  ...props
}) => (
  <Flex {...styles.root({ isLeftAligned })} {...props}>
    <Flex {...styles.container({ isLeftAligned })}>
      <Avatar src={avatar} />
      <Flex {...styles.content({ isLeftAligned })}>
        <Balloon {...styles.balloon({ balloon, isLeftAligned })} onClick={onBalloonClick}>
          {children}
        </Balloon>
      </Flex>
      <Flex {...styles.info({ isLeftAligned })}>
        <Text {...styles.read({ isRead })}>Read</Text>
        <Text {...styles.infoText}>{time}</Text>
      </Flex>
    </Flex>
  </Flex>
)

/** Container Component */
const MessageShowcaseContainer: React.VFC<ContainerProps<MessageShowcaseProps, PresenterProps>> = ({
  presenter,
  messagePosition,
  ...props
}) => {
  const isLeftAligned = 'left' === messagePosition
  return presenter({ isLeftAligned, ...props })
}

/** MessageShowcase */
export default connect<MessageShowcaseProps, PresenterProps>(
  'MessageShowcase',
  MessageShowcasePresenter,
  MessageShowcaseContainer
)
