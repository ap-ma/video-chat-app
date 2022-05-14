import { Avatar, AvatarProps, Box, Flex, FlexProps, Link, Text } from '@chakra-ui/react'
import React, { ReactText } from 'react'

export type ContactCardProps = FlexProps & {
  image: AvatarProps['src']
  name: ReactText
  desc?: ReactText
}

const ContactCard: React.VFC<ContactCardProps> = ({ image, name, desc, ...props }) => (
  <Link href='#' style={{ textDecoration: 'none' }}>
    <Flex
      align='center'
      py='4'
      px='3'
      marginStart='1'
      borderRadius='lg'
      role='group'
      cursor='pointer'
      _hover={{
        bg: 'gray.100'
      }}
      {...props}
    >
      <Avatar size='md' src={image} />
      <Box ml='3' overflow='hidden'>
        <Text fontWeight='bold' overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>
          {name}
        </Text>
        <Text fontSize='sm' color='gray.600' overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>
          {desc}
        </Text>
      </Box>
    </Flex>
  </Link>
)

export default ContactCard
