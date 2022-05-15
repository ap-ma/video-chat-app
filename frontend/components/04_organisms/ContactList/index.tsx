import { Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Scrollbar, { ScrollbarProps } from 'components/02_interactions/Scrollbar'
import UserCard, { UserCardProps } from 'components/04_organisms/UserCard'
import { connect } from 'components/hoc'
import { ContactInfoQuery, ContactInfoQueryVariables, ContactsQuery } from 'graphql/generated'
import React, { Fragment } from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'
import { ContainerProps, LocalStorageVariables, QueryRefetch } from 'types'
import { SetContactInfoUserId } from 'utils/apollo/state'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** ContactList Props */
export type ContactListProps = ScrollbarProps & {
  /**
   * コンタクト一覧
   */
  contacts?: ContactsQuery['contacts']
  /**
   * Local State
   */
  state: {
    /**
     *  コンタクト情報 ユーザーID
     */
    contactInfoUserId: {
      state: LocalStorageVariables
      setContactInfoUserId: SetContactInfoUserId
    }
  }
  /**
   * Query
   */
  query: {
    /**
     *  コンタクト情報
     */
    contactInfo: {
      refetch: QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ContactListProps, 'contacts' | 'state' | 'query'> & {
  contactList?: UserCardProps[]
  register: UseFormRegister<FormSchema>
}

/** Presenter Component */
const ContactListPresenter: React.VFC<PresenterProps> = ({ contactList, register, ...props }) => (
  <Fragment>
    <Input type='text' placeholder='filter contacts...' {...styles.filter} {...register('filter')} />
    <Scrollbar mt='0.2em' {...props}>
      {contactList?.map((contact, i) => (
        <UserCard key={i} {...contact} />
      ))}
    </Scrollbar>
  </Fragment>
)

/** Container Component */
const ContactListContainer: React.VFC<ContainerProps<ContactListProps, PresenterProps>> = ({
  presenter,
  contacts,
  state: { contactInfoUserId },
  query: { contactInfo },
  ...props
}) => {
  // react hook form
  const { register, watch } = useForm<FormSchema>({
    resolver: zodResolver(schema)
  })

  // contact list
  const filter = watch('filter', '')
  const contactList = contacts
    ?.filter((contact) => contact.userName?.includes(filter))
    .map((contact) => ({
      image: contact.userAvatar ?? undefined,
      name: toStr(contact.userName),
      content: contact.userComment ?? undefined,
      active: contactInfoUserId.state === contact.userId,
      onClick: () => {
        contactInfoUserId.setContactInfoUserId(contact.userId)
        contactInfo.refetch({ contactUserId: contact.userId })
      }
    }))

  return presenter({ contactList, register, ...props })
}

/** ContactList */
export default connect<ContactListProps, PresenterProps>('ContactList', ContactListPresenter, ContactListContainer)
