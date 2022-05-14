import { Box, BoxProps } from '@chakra-ui/react'
import React from 'react'
import ContactCard, { ContactCardProps } from './ContactCard'

export type ContactListProps = BoxProps & {
  contacts: ContactCardProps[]
}

const ContactList: React.VFC<ContactListProps> = ({ contacts, ...props }) => (
  <Box
    overflowY='scroll'
    sx={{
      scrollbarWidth: 'thin',
      '&::-webkit-scrollbar': {
        width: '5px'
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'gray.300',
        borderRadius: '2.5px'
      }
    }}
    {...props}
  >
    {contacts.map((contact, i) => (
      <ContactCard key={i} {...contact} />
    ))}
  </Box>
)

export default ContactList
