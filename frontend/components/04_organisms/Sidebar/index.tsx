import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { connect } from 'components/hoc'
import { APP_NAME } from 'const'
import React from 'react'
import { ContainerProps, OnClose } from 'types'
import ContactList from './ContactList'

export type SidebarProps = BoxProps & {
  /**
   * 閉じるボタン押下時処理
   */
  onClose: OnClose
}

/** Presenter Props */
export type PresenterProps = SidebarProps

/** Presenter Component */
const SidebarPresenter: React.VFC<PresenterProps> = ({ onClose, ...props }) => (
  <Box
    transition='3s ease'
    bg={useColorModeValue('white', 'gray.900')}
    borderRight='1px'
    borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    w={{ base: 'full', md: 72 }}
    pos='absolute'
    h='full'
    {...props}
  >
    <Flex h='20' ml='4' mr='8' alignItems='center' justifyContent='space-between'>
      <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold'>
        {APP_NAME}
      </Text>
      <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
    </Flex>
    <Tabs isFitted variant='enclosed-colored'>
      <TabList>
        <Tab py='1'>Contacts</Tab>
        <Tab py='1'>Chats</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p='0'>
          <Input focusBorderColor='gray.200' placeholder='ユーザーを検索' />
          <ContactList
            /* 全体 - (ヘッダー部 + tabボタン部 + 検索部 + 余白部) */
            h='calc(100vh - (var(--chakra-sizes-20) + 34px + 40px + 8px))'
            contacts={contactList((i) => (i % 3 != 0 ? `ひとことのサンプル${i}` : undefined))}
          />
        </TabPanel>
        <TabPanel p='0' mt='0.5em'>
          <ContactList
            /* 全体 - (ヘッダー部 + tabボタン部 + margin部 + 余白部) */
            h='calc(100vh - (var(--chakra-sizes-20) + 34px + 8px + 8px))'
            contacts={contactList((i) =>
              i % 3 != 0 ? `メッセージのやり取りのサンプル${i}` : 'コンタクトに追加されました'
            )}
          />
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
