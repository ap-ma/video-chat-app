import { SearchIcon } from '@chakra-ui/icons'
import {
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalContent,
  Text
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import Modal, { ModalProps } from 'components/01_atoms/Modal'
import UserCard, { UserCardProps } from 'components/03_molecules/UserCard'
import { connect } from 'components/hoc'
import {
  ContactInfoQuery,
  ContactInfoQueryVariables,
  SearchUserQuery,
  SearchUserQueryVariables
} from 'graphql/generated'
import React, { useCallback, useMemo, useState } from 'react'
import { FieldErrors, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import { ContainerProps, LazyQueryFunction, QueryLoading, QueryRefetch } from 'types'
import { ContactInfoUserId, SetContactInfoUserId } from 'utils/apollo/state'
import { toStr } from 'utils/general/helper'
import { hasValue, isNullish } from 'utils/general/object'
import * as styles from './styles'
import { FormSchema, schema } from './validation'

/** SearchUser Props */
export type SearchUserProps = Omit<ModalProps, 'children'> & {
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
     *  コンタクト情報
     */
    contactInfo: {
      refetch: QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
    }
    /**
     * ユーザー検索
     */
    searchUser: {
      result?: SearchUserQuery['searchUser']
      loading: QueryLoading
      query: LazyQueryFunction<SearchUserQuery, SearchUserQueryVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<SearchUserProps, 'state' | 'query'> & {
  called: boolean
  loading: QueryLoading
  fieldErrors: FieldErrors<FormSchema>
  register: UseFormRegister<FormSchema>
  onSearchButtonClick: ReturnType<UseFormHandleSubmit<FormSchema>>
  result?: UserCardProps
}

/** Presenter Component */
const SearchUserPresenter: React.VFC<PresenterProps> = ({
  called,
  loading,
  fieldErrors,
  register,
  onSearchButtonClick,
  result,
  ...props
}) => (
  <Modal closeOnOverlayClick {...props}>
    <ModalContent {...styles.content}>
      <ModalBody w='full' my='0.5'>
        <InputGroup size='lg'>
          <FormControl id='su_code' isDisabled={loading} isInvalid={hasValue(fieldErrors.code)}>
            <Input
              type='text'
              placeholder='Enter code of user you want to find'
              {...styles.input}
              {...register('code')}
            />
            <InputRightElement>
              <IconButton {...styles.search} icon={<SearchIcon />} onClick={onSearchButtonClick} />
            </InputRightElement>
            <FormErrorMessage mb='1'>{fieldErrors.code?.message}</FormErrorMessage>
          </FormControl>
        </InputGroup>
      </ModalBody>
      <ModalBody {...styles.result({ called })}>
        <UserCard {...styles.card({ result })} {...result} />
        <Text {...styles.noResult({ result })}>No result found.</Text>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const SearchUserContainer: React.VFC<ContainerProps<SearchUserProps, PresenterProps>> = ({
  presenter,
  isOpen,
  onClose: onSuClose,
  state: { contactInfoUserId },
  query: { contactInfo, searchUser },
  ...props
}) => {
  // state
  const [called, setCalled] = useState(false)

  // react hook form
  const { register, handleSubmit, reset, formState } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    reValidateMode: 'onSubmit'
  })

  // status
  const loading = searchUser.loading
  const fieldErrors = formState.errors

  // query
  const searchUserQuery: SubmitHandler<FormSchema> = ({ code }) => {
    setCalled(false)
    searchUser
      .query({ variables: { userCode: code } })
      .then(() => setCalled(true))
      .catch(console.error)
  }

  // onClick search button
  const onSearchButtonClick = handleSubmit(searchUserQuery)

  // modal onClose
  const onClose = useCallback(() => {
    onSuClose()
    reset()
    setCalled(false)
  }, [onSuClose, reset])

  useMemo(() => {
    if (!isOpen) {
      reset()
      setCalled(false)
    }
  }, [isOpen, reset])

  // result
  let result: PresenterProps['result'] = undefined
  if (!loading && called && !isNullish(searchUser.result)) {
    const user = searchUser.result
    result = {
      image: toStr(user.avatar),
      name: toStr(user.name),
      note: toStr(user.comment),
      button: {
        children: 'Open',
        onClick: () => {
          contactInfoUserId.setContactInfoUserId(user.id)
          contactInfo.refetch({ contactUserId: user.id })
          onClose()
        }
      }
    }
  }

  return presenter({
    isOpen,
    onClose,
    called,
    loading,
    fieldErrors,
    register,
    onSearchButtonClick,
    result,
    ...props
  })
}

/** SearchUser */
export default connect<SearchUserProps, PresenterProps>('SearchUser', SearchUserPresenter, SearchUserContainer)
