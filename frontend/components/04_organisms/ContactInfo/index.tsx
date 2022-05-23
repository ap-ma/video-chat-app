import { Avatar, Box, Flex, FlexProps, IconButton, Text } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { ContainerProps } from 'types'

/** ContactInfo Props */
export type ContactInfoProps = FlexProps
/** Presenter Props */
export type PresenterProps = ContactInfoProps

/** Presenter Component */
const ContactInfoPresenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Flex
    {...{
      align: 'center',
      py: '0.7rem',
      px: '4',
      role: 'group',
      bg: 'gray.50',
      borderBottomWidth: '5px',
      borderBottomStyle: 'double',
      borderBottomColor: 'gray.200'
    }}
  >
    <Avatar
      size='md'
      src='https://1.bp.blogspot.com/-00OxkKkBAFk/XzXk2V2J6sI/AAAAAAABamk/bQcMCNYq5XkGs5aEGUoU1dkBdoAg7pocACNcBGAsYHQ/s1600/gao_pose_woman.png'
    />
    <Box ml='4' overflow='hidden'>
      <Text
        {...{
          fontSize: 'md',
          fontWeight: 'bold',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          lineHeight: 'normal'
        }}
      >
        Ken
      </Text>
      <Text
        {...{
          fontSize: 'sm',
          color: 'gray.600',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          lineHeight: 'shorter'
        }}
      >
        {"i'm fine"}
      </Text>
    </Box>
    <IconButton
      ml='auto'
      mr='2'
      size='sm'
      fontSize='xl'
      color='gray.700'
      bg='transparent'
      _hover={{ bg: 'transparent' }}
      _focus={{ border: 0 }}
      aria-label='config'
      icon={<IoSettingsOutline />}
    />
  </Flex>
)

/** Container Component */
const ContactInfoContainer: React.VFC<ContainerProps<ContactInfoProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** ContactInfo */
export default connect<ContactInfoProps, PresenterProps>('ContactInfo', ContactInfoPresenter, ContactInfoContainer)
