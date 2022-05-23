import { Avatar, Box, Flex, FlexProps, Icon, Text } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { ContainerProps } from 'types'

/** Chat Props */
export type ChatProps = FlexProps
/** Presenter Props */
export type PresenterProps = ChatProps

/** Presenter Component */
const ChatPresenter: React.VFC<PresenterProps> = ({ ...props }) => (
  <Flex
    {...{
      align: 'center',
      py: '4',
      px: '6',
      role: 'group',
      flex: 'auto'
    }}
  >
    <Avatar
      size='md'
      src='https://1.bp.blogspot.com/-00OxkKkBAFk/XzXk2V2J6sI/AAAAAAABamk/bQcMCNYq5XkGs5aEGUoU1dkBdoAg7pocACNcBGAsYHQ/s1600/gao_pose_woman.png'
    />
    <Box ml='3' overflow='hidden'>
      <Text
        {...{
          fontWeight: 'bold',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
      >
        Joenny
      </Text>
      <Text
        {...{ fontSize: 'sm', color: 'gray.600', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
      >
        {"i'm fine"}
      </Text>
    </Box>
    <Icon ml='auto' w={5} h={5} as={IoSettingsOutline} />
  </Flex>
)

/** Container Component */
const ChatContainer: React.VFC<ContainerProps<ChatProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Chat */
export default connect<ChatProps, PresenterProps>('Chat', ChatPresenter, ChatContainer)
