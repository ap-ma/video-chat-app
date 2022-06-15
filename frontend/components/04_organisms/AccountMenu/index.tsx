import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemProps,
  MenuList,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import { connect } from 'components/hoc'
import { MeQuery, SignOutMutation, SignOutMutationVariables } from 'graphql/generated'
import React from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { ContainerProps, MutaionLoading, MutateFunction, OnOpen } from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** AccountMenu Props */
export type AccountMenuProps = FlexProps & {
  /**
   * プロフィール編集モーダル onOpen
   */
  onEpfOpen: OnOpen
  /**
   * メールアドレス変更モーダル onOpen
   */
  onCefOpen: OnOpen
  /**
   * パスワード変更変更モーダル onOpen
   */
  onCpfOpen: OnOpen
  /**
   * アカウント削除ダイアログ onOpen
   */
  onDadOpen: OnOpen
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
  }
  /**
   * Mutation
   */
  mutation: {
    /**
     * サインアウト
     */
    signOut: {
      loading: MutaionLoading
      mutate: MutateFunction<SignOutMutation, SignOutMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<AccountMenuProps, 'mutation'> & {
  loading: MutaionLoading
  onSignOutButtonClick: MenuItemProps['onClick']
}

/** Presenter Component */
const AccountMenuPresenter: React.VFC<PresenterProps> = ({
  query: { me },
  onEpfOpen,
  onCefOpen,
  onCpfOpen,
  onDadOpen,
  loading,
  onSignOutButtonClick,
  ...props
}) => (
  <Flex alignItems='center' {...props}>
    <Menu>
      <MenuButton {...styles.trigger}>
        <HStack spacing={3}>
          <Avatar {...styles.avatar} src={toStr(me.result?.avatar)} />
          <VStack {...styles.userInfo}>
            <Text {...styles.name}>{me.result?.name}</Text>
            <Text {...styles.code}>code: {me.result?.code}</Text>
          </VStack>
          <Box {...styles.arrow}>
            <FiChevronDown />
          </Box>
        </HStack>
      </MenuButton>
      <MenuList {...styles.list}>
        <MenuGroup title='Profile'>
          <MenuItem {...styles.item} isDisabled={loading} onClick={onEpfOpen}>
            Edit Profile
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title='Account'>
          <MenuItem {...styles.item} isDisabled={loading} onClick={onCefOpen}>
            Change Email
          </MenuItem>
          <MenuItem {...styles.item} isDisabled={loading} onClick={onCpfOpen}>
            Change Password
          </MenuItem>
          <MenuItem {...styles.item} isDisabled={loading} onClick={onDadOpen}>
            Delete Account
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuItem {...styles.signOut} isDisabled={loading} onClick={onSignOutButtonClick}>
          <Text {...styles.signOutText({ loading })}>Sign out</Text>
          <Spinner {...styles.signOutSpinner({ loading })} />
        </MenuItem>
      </MenuList>
    </Menu>
  </Flex>
)

/** Container Component */
const AccountMenuContainer: React.VFC<ContainerProps<AccountMenuProps, PresenterProps>> = ({
  presenter,
  mutation: { signOut },
  ...props
}) => {
  const loading = signOut.loading
  const onSignOutButtonClick = () => signOut.mutate().catch(toast('ValidationError'))
  return presenter({ loading, onSignOutButtonClick, ...props })
}

/** AccountMenu */
export default connect<AccountMenuProps, PresenterProps>('AccountMenu', AccountMenuPresenter, AccountMenuContainer)
