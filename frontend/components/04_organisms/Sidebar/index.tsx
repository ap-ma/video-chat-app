import { Box, BoxProps, CloseButton, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import AppLogo from 'components/01_atoms/AppLogo'
import ChatList from 'components/04_organisms/ChatList'
import ContactList from 'components/04_organisms/ContactList'
import { connect } from 'components/hoc'
import {
  ContactInfoQuery,
  ContactInfoQueryVariables,
  ContactsQuery,
  LatestMessagesQuery,
  MeQuery
} from 'graphql/generated'
import React from 'react'
import { ContainerProps, OnClose, QueryRefetch } from 'types'
import { ContactInfoUserId, SetContactInfoUserId } from 'utils/apollo/state'
import * as styles from './styles'

/** Sidebar Props */
export type SidebarProps = BoxProps & {
  /**
   * サイドバー onClose
   */
  onClose: OnClose
  /**
   * Local State
   */
  state: {
    /**
     *  コンタクト情報 ユーザーID
     */
    contactInfoUserId: {
      state: ContactInfoUserId
      setContactInfoUserId: SetContactInfoUserId
    }
  }
  /**
   * Query
   */
  query: {
    /**
     * サインインユーザー情報
     */
    me: {
      result?: MeQuery['me']
    }
    /**
     * コンタクト一覧
     */
    contacts: {
      result?: ContactsQuery['contacts']
    }
    /**
     * メッセージ一覧
     */
    latestMessages: {
      result?: LatestMessagesQuery['latestMessages']
    }
    /**
     *  コンタクト情報
     */
    contactInfo: {
      refetch: QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = SidebarProps

/** Presenter Component */
const SidebarPresenter: React.VFC<PresenterProps> = ({
  state,
  query: { me, contacts, latestMessages, contactInfo },
  onClose,
  ...props
}) => (
  <Box {...styles.root} {...props}>
    <Flex {...styles.head}>
      <AppLogo />
      <CloseButton {...styles.close} onClick={onClose} />
    </Flex>
    <Tabs isFitted {...styles.tab}>
      <TabList>
        <Tab py='1'>Contacts</Tab>
        <Tab py='1'>Chats</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p='0'>
          <ContactList {...styles.contacts} state={state} query={{ me, contacts, contactInfo }} />
        </TabPanel>
        <TabPanel p='0'>
          <ChatList {...styles.chats} state={state} query={{ me, latestMessages, contactInfo }} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Box>
)

/** Container Component */
const SidebarContainer: React.VFC<ContainerProps<SidebarProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Sidebar */
export default connect<SidebarProps, PresenterProps>('Sidebar', SidebarPresenter, SidebarContainer)
