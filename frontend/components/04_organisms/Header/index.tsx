import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack
} from '@chakra-ui/react'
import AppLogo from 'components/01_atoms/AppLogo'
import { connect } from 'components/hoc'
import { MeQuery } from 'graphql/generated'
import React from 'react'
import { FiBell, FiChevronDown } from 'react-icons/fi'
import { GrContactInfo } from 'react-icons/gr'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Header Props */
export type HeaderProps = Omit<FlexProps, 'me'> & {
  /**
   * サインインユーザー情報
   */
  me?: MeQuery['me']
}

/** Presenter Props */
export type PresenterProps = Omit<HeaderProps, 'me'>

/** Presenter Component */
const HeaderPresenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Flex {...styles.root} {...props}>
    <IconButton
      d={{ base: 'flex', md: 'none' }}
      onClick={() => console.log('onClick')}
      variant='outline'
      aria-label='open menu'
      mr={{ base: '5', md: '2' }}
      icon={<GrContactInfo />}
    />

    <AppLogo d={{ base: 'flex', md: 'none' }} />

    <HStack spacing={{ base: '2', md: '6' }}>
      <IconButton size='lg' variant='ghost' aria-label='open menu' icon={<FiBell />} />
      <Flex alignItems='center'>
        <Menu>
          <MenuButton py={2} transition='all 0.3s' _focus={{ boxShadow: 'none' }}>
            <HStack>
              <Avatar
                size='sm'
                src={
                  'https://1.bp.blogspot.com/-DU9jll2ZQ38/XexqGlVzO9I/AAAAAAABWdQ/m0lQONbEfSgEjIN14h7iIfRh8WS5qwrFACNcBGAsYHQ/s1600/gal_o_man.png'
                }
              />
              <VStack display={{ base: 'none', md: 'flex' }} alignItems='flex-start' spacing='1px' ml='2'>
                <Text fontSize='sm'>名前 太郎</Text>
                <Text fontSize='xs' color='gray.600'>
                  Code: sndsDas13D
                </Text>
              </VStack>
              <Box display={{ base: 'none', md: 'flex' }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList bg='white' borderColor='gray.200'>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Account</MenuItem>
            <MenuDivider />
            <MenuItem>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </HStack>
  </Flex>
)

/** Container Component */
const HeaderContainer: React.VFC<ContainerProps<HeaderProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Header */
export default connect<HeaderProps, PresenterProps>('Header', HeaderPresenter, HeaderContainer)
