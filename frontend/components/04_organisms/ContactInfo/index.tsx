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
import { ContactInfoQuery } from 'graphql/generated'
import React from 'react'
import { AiOutlineMenu, AiOutlinePhone } from 'react-icons/ai'
import { ContainerProps, OnOpen, QueryLoading, QueryNetworkStatus } from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** ContactInfo Props */
export type ContactInfoProps = FlexProps & {
  /**
   * 架電ダイアログ onOpen
   */
  onMccdOpen: OnOpen
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
     *  コンタクト情報
     */
    contactInfo: {
      result?: ContactInfoQuery['contactInfo']
      networkStatus: QueryNetworkStatus
    }
  }
}

/** Presenter Props */
export type PresenterProps = ContactInfoProps & {
  loading: QueryLoading
  disabled: boolean
  approved: boolean
  deleted: boolean
  notBlocked: boolean
  blocked: boolean
}

/** Presenter Component */
const ContactInfoPresenter: React.VFC<PresenterProps> = ({
  query: { contactInfo },
  loading,
  disabled,
  approved,
  deleted,
  notBlocked,
  blocked,
  onMccdOpen,
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
    <IconButton icon={<AiOutlinePhone />} {...styles.phoneIcon} aria-label='make a call' onClick={onMccdOpen} />
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
const ContactInfoContainer: React.VFC<ContainerProps<ContactInfoProps, PresenterProps>> = ({
  presenter,
  query: { contactInfo },
  ...props
}) => {
  // status
  const loading = NetworkStatus.refetch === contactInfo.networkStatus
  const disabled = CONTACT.STATUS.UNAPPROVED === contactInfo.result?.status || loading
  const approved = CONTACT.STATUS.APPROVED === contactInfo.result?.status
  const deleted = CONTACT.STATUS.DELETED === contactInfo.result?.status
  const notBlocked = CONTACT.STATUS.UNAPPROVED !== contactInfo.result?.status && !contactInfo.result?.blocked
  const blocked = CONTACT.STATUS.UNAPPROVED !== contactInfo.result?.status && !!contactInfo.result?.blocked

  return presenter({
    query: { contactInfo },
    loading,
    disabled,
    approved,
    deleted,
    notBlocked,
    blocked,
    ...props
  })
}

/** ContactInfo */
export default connect<ContactInfoProps, PresenterProps>('ContactInfo', ContactInfoPresenter, ContactInfoContainer)
