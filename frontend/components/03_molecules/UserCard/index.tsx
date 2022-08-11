import { Avatar, AvatarProps, Box, Button, ButtonProps, Center, CenterProps, Heading, Text } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React, { ReactText } from 'react'
import { ContainerProps } from 'types'
import { isBlank, isNullish } from 'utils/general/object'
import * as styles from './styles'

/** UserCard Props */
export type UserCardProps = CenterProps &
  Partial<{
    /**
     * アバター画像URL
     */
    image: AvatarProps['src']
    /**
     * ユーザー名
     */
    name: ReactText
    /**
     * 備考テキスト
     */
    note: ReactText
    /**
     * ボタン Props
     */
    button: ButtonProps
  }>

/** Presenter Props */
export type PresenterProps = UserCardProps

/** Presenter Component */
const UserCardPresenter: React.VFC<PresenterProps> = ({ image, name, note, button, ...props }) => (
  <Center {...props}>
    <Box {...styles.container}>
      <Avatar {...styles.avatar} src={image} />
      <Heading {...styles.name}>{name}</Heading>
      <Text {...styles.note}>{note}</Text>
      <Button {...styles.button} {...button} />
    </Box>
  </Center>
)

/** Container Component */
const UserCardContainer: React.VFC<ContainerProps<UserCardProps, PresenterProps>> = ({
  presenter,
  button,
  ...props
}) => {
  if (!isNullish(button) && isBlank(button.children)) button.children = 'OK'
  return presenter({ button, ...props })
}

/** UserCard */
export default connect<UserCardProps, PresenterProps>('UserCard', UserCardPresenter, UserCardContainer)
