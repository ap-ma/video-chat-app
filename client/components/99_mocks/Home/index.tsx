import { Box, Drawer, DrawerContent, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import Header from 'components/99_mocks/Home/Header'
import Sidebar from 'components/99_mocks/Home/Sidebar'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const App: React.VFC<Props> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box minH='100vh' bg={useColorModeValue('gray.100', 'gray.900')}>
      <Sidebar onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size='full'
      >
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <Header onOpen={onOpen} />
      <Box ml={{ base: 0, md: 72 }} p='4'>
        {children}
      </Box>
    </Box>
  )
}
export default App
