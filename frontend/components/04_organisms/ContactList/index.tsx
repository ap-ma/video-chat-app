import { Input } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Scrollbar, { ScrollbarProps } from 'components/02_interactions/Scrollbar'
import UserCard, { UserCardProps } from 'components/04_organisms/UserCard'
import { connect } from 'components/hoc'
import { ContactInfoQuery, ContactInfoQueryVariables, ContactsQuery, MeQuery } from 'graphql/generated'
import React, { Fragment } from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'
import { ContainerProps, QueryRefetch, Unbox } from 'types'
import { ContactInfoUserId, SetContactInfoUserId } from 'utils/apollo/state'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** ContactList Props */
export type ContactListProps = ScrollbarProps & {
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
     *  コンタクト情報
     */
    contactInfo: {
      refetch: QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ContactListProps, 'state' | 'query'> & {
  contactList?: Unbox<UserCardProps & { key: Unbox<ContactsQuery['contacts']>['userId'] }>[]
  register: UseFormRegister<FormSchema>
}

/** Presenter Component */
const ContactListPresenter: React.VFC<PresenterProps> = ({ contactList, register, ...props }) => (
  <Fragment>
    <Input type='text' placeholder='filter contacts...' {...styles.filter} {...register('filter')} />
    <Scrollbar mt='0.2em' {...props}>
      {contactList?.map(({ key, ...contact }) => (
        <UserCard key={key} {...contact} />
      ))}
    </Scrollbar>
  </Fragment>
)

/** Container Component */
const ContactListContainer: React.VFC<ContainerProps<ContactListProps, PresenterProps>> = ({
  presenter,
  state: { contactInfoUserId },
  query: { me, contacts, contactInfo },
  ...props
}) => {
  // react hook form
  const { register, watch } = useForm<FormSchema>({
    resolver: zodResolver(schema)
  })

  // contact list
  const filter = watch('filter', '')
  const contactList = contacts.result
    ?.filter((contact) => contact.userName?.includes(filter))
    .map((contact) => ({
      key: contact.userId,
      image: contact.userAvatar ?? undefined,
      name: toStr(me.result?.id === contact.userId ? `${contact.userName} (myself)` : contact.userName),
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
