import { Avatar, AvatarProps, Box, Flex, FlexProps, Link, Text } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React, { ReactText } from 'react'
import { ContainerProps } from 'types'
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
}
/** Presenter Props */
type PresenterProps = UserCardProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ image, name, content, active, ...props }) => (
  <Link {...styles.root({ active })}>
    <Flex {...styles.box({ active })} {...props}>
      <Avatar size='md' src={image} />
      <Box ml='3' overflow='hidden'>
        <Text {...styles.name}>{name}</Text>
        <Text {...styles.content}>{content}</Text>
      </Box>
    </Flex>
  </Link>
)

/** Container Component */
const Container: React.VFC<ContainerProps<UserCardProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** UserCard */
export default connect<UserCardProps, PresenterProps>('UserCard', Presenter, Container)
