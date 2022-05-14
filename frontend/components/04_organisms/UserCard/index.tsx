import { Avatar, AvatarProps, Box, Flex, FlexProps, Text } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React, { ReactText } from 'react'
import { ContainerProps } from 'types'
import { toStr } from 'utils/general/helper'
import { isNullish } from 'utils/general/object'
import * as styles from './styles'

/** UserCard Props */
export type UserCardProps = FlexProps & {
  /**
   * アバター画像URL
   */
  image?: AvatarProps['src']
  /**
   * ユーザー名
   */
  name: ReactText
  /**
   * カード内コンテンツ
   */
  content?: ReactText
  /**
   * 選択状態か否か
   */
  active?: boolean
  /**
   * 未読件数
   */
  unreadCount?: number
}

/** Presenter Props */
export type PresenterProps = Omit<UserCardProps, 'unreadCount'> & { count: string }

/** Presenter Component */
const UserCardPresenter: React.VFC<PresenterProps> = ({ image, name, content, active, count, ...props }) => (
  <Flex {...styles.root({ active })} {...props}>
    <Avatar size='md' src={image} />
    <Box ml='3' overflow='hidden'>
      <Text {...styles.name}>{name}</Text>
      <Text {...styles.content}>{content}</Text>
    </Box>
    <Text {...styles.count({ count })}>{count}</Text>
  </Flex>
)

/** Container Component */
const UserCardContainer: React.VFC<ContainerProps<UserCardProps, PresenterProps>> = ({
  presenter,
  unreadCount,
  ...props
}) => {
  const count = !isNullish(unreadCount) && unreadCount > 99 ? '99+' : toStr(unreadCount)
  return presenter({ count, ...props })
}

/** UserCard */
export default connect<UserCardProps, PresenterProps>('UserCard', UserCardPresenter, UserCardContainer)
