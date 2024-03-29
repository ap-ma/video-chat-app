import { NetworkStatus } from '@apollo/client'
import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text
} from '@chakra-ui/react'
import { connect } from 'components/hoc'
import { CONTACT } from 'const'
import { ContactInfoQuery, MeQuery } from 'graphql/generated'
import React from 'react'
import { AiOutlineMenu, AiOutlinePhone } from 'react-icons/ai'
import { ContainerProps, OnOpen, QueryLoading, QueryNetworkStatus } from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** ContactInfoHead Props */
export type ContactInfoHeadProps = FlexProps & {
  /**
   * 通話架電ダイアログ onOpen
   */
  onRucdOpen: OnOpen
  /**
   * コンタクト削除ダイアログ onOpen
   */
  onDccdOpen: OnOpen
  /**
   * コンタクト削除解除ダイアログ onOpen
   */
  onUdccdOpen: OnOpen
  /**
   * コンタクトブロックダイアログ onOpen
   */
  onBccdOpen: OnOpen
  /**
   * コンタクトブロック解除ダイアログ onOpen
   */
  onUbccdOpen: OnOpen
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
      networkStatus: QueryNetworkStatus
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ContactInfoHeadProps, 'query'> & {
  query: Omit<ContactInfoHeadProps['query'], 'me'>
} & {
  loading: QueryLoading
  disabled: boolean
  notCallable: boolean
  approved: boolean
  deleted: boolean
  notBlocked: boolean
  blocked: boolean
}

/** Presenter Component */
const ContactInfoHeadPresenter: React.VFC<PresenterProps> = ({
  query: { contactInfo },
  loading,
  disabled,
  notCallable,
  approved,
  deleted,
  notBlocked,
  blocked,
  onRucdOpen,
  onDccdOpen,
  onUdccdOpen,
  onBccdOpen,
  onUbccdOpen,
  ...props
}) => (
  <Flex {...styles.root} {...props}>
    <Avatar {...styles.avatar({ loading })} src={toStr(contactInfo.result?.userAvatar)} />
    <Box {...styles.userInfo({ loading })}>
      <Text {...styles.name}>{contactInfo.result?.userName}</Text>
      <Text {...styles.comment}>{contactInfo.result?.userComment}</Text>
    </Box>
    <Spinner {...styles.spinner({ loading })} />
    <IconButton
      icon={<AiOutlinePhone />}
      {...styles.phoneIcon({ notCallable })}
      aria-label='ring up'
      onClick={onRucdOpen}
    />
    <Menu>
      <MenuButton as={IconButton} icon={<AiOutlineMenu />} {...styles.menuIcon({ disabled })} />
      <MenuList>
        <MenuItem {...styles.deleteMenu({ approved })} onClick={onDccdOpen}>
          Delete Contact
        </MenuItem>
        <MenuItem {...styles.undeleteMenu({ deleted })} onClick={onUdccdOpen}>
          Undelete Contact
        </MenuItem>
        <MenuItem {...styles.blockMenu({ notBlocked })} onClick={onBccdOpen}>
          Block Contact
        </MenuItem>
        <MenuItem {...styles.unblockMenu({ blocked })} onClick={onUbccdOpen}>
          Unblock Contact
        </MenuItem>
      </MenuList>
    </Menu>
  </Flex>
)

/** Container Component */
const ContactInfoHeadContainer: React.VFC<ContainerProps<ContactInfoHeadProps, PresenterProps>> = ({
  presenter,
  query: { me, contactInfo },
  ...props
}) => {
  // status
  const loading = NetworkStatus.refetch === contactInfo.networkStatus
  const disabled =
    loading || me.result?.id === contactInfo.result?.userId || CONTACT.STATUS.UNAPPROVED === contactInfo.result?.status
  const approved = CONTACT.STATUS.APPROVED === contactInfo.result?.status
  const deleted = CONTACT.STATUS.DELETED === contactInfo.result?.status
  const notBlocked = CONTACT.STATUS.UNAPPROVED !== contactInfo.result?.status && !contactInfo.result?.blocked
  const blocked = CONTACT.STATUS.UNAPPROVED !== contactInfo.result?.status && !!contactInfo.result?.blocked
  const notCallable = me.result?.id === contactInfo.result?.userId || blocked

  return presenter({
    query: { contactInfo },
    loading,
    disabled,
    notCallable,
    approved,
    deleted,
    notBlocked,
    blocked,
    ...props
  })
}

/** ContactInfoHead */
export default connect<ContactInfoHeadProps, PresenterProps>(
  'ContactInfoHead',
  ContactInfoHeadPresenter,
  ContactInfoHeadContainer
)
