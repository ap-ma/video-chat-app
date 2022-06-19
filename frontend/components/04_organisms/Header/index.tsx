import { Flex, FlexProps, HStack, IconButton, useDisclosure } from '@chakra-ui/react'
import AppLogo from 'components/01_atoms/AppLogo'
import AccountMenu from 'components/04_organisms/AccountMenu'
import SearchUser from 'components/04_organisms/SearchUser'
import ChangeEmailCompleteDialog from 'components/04_organisms/_dialogs/ChangeEmailCompleteDialog'
import ChangePasswordCompleteDialog from 'components/04_organisms/_dialogs/ChangePasswordCompleteDialog'
import DeleteAccountConfirmDialog from 'components/04_organisms/_dialogs/DeleteAccountConfirmDialog'
import ChangeEmailForm from 'components/04_organisms/_forms/ChangeEmailForm'
import ChangePasswordForm from 'components/04_organisms/_forms/ChangePasswordForm'
import EditProfileForm from 'components/04_organisms/_forms/EditProfileForm'
import { connect } from 'components/hoc'
import {
  ChangeEmailMutation,
  ChangeEmailMutationVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  ContactInfoQuery,
  ContactInfoQueryVariables,
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  EditProfileMutation,
  EditProfileMutationVariables,
  MeQuery,
  MeQueryVariables,
  SearchUserQuery,
  SearchUserQueryVariables,
  SignOutMutation,
  SignOutMutationVariables
} from 'graphql/generated'
import React, { useMemo } from 'react'
import { ImSearch } from 'react-icons/im'
import { RiContactsLine } from 'react-icons/ri'
import {
  ContactInfoUserId,
  ContainerProps,
  Disclosure,
  LazyQueryFunction,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  OnOpen,
  QueryLoading,
  QueryRefetch,
  SetContactInfoUserId,
  ValidationErrors
} from 'types'
import * as styles from './styles'

/** Header Props */
export type HeaderProps = FlexProps & {
  /**
   * サイドバー onOpen
   */
  onSbOpen: OnOpen
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
     * ユーザー情報
     */
    me: {
      result?: MeQuery['me']
      loading: QueryLoading
      refetch: QueryRefetch<MeQuery, MeQueryVariables>
    }
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
  /**
   * Mutation
   */
  mutation: {
    /**
     * サインアウト
     */
    signOut: {
      loading: MutaionLoading
      mutate: MutateFunction<SignOutMutation, SignOutMutationVariables>
    }
    /**
     * プロフィール編集
     */
    editProfile: {
      result?: EditProfileMutation['editProfile']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<EditProfileMutation, EditProfileMutationVariables>
    }
    /**
     * メールアドレス変更
     */
    changeEmail: {
      result?: ChangeEmailMutation['changeEmail']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ChangeEmailMutation, ChangeEmailMutationVariables>
    }
    /**
     * パスワード変更
     */
    changePassword: {
      result?: ChangePasswordMutation['changePassword']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ChangePasswordMutation, ChangePasswordMutationVariables>
    }
    /**
     * アカウント削除
     */
    deleteAccount: {
      result?: DeleteAccountMutation['deleteAccount']
      loading: MutaionLoading
      mutate: MutateFunction<DeleteAccountMutation, DeleteAccountMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = HeaderProps & {
  suDisc: Disclosure
  epfDisc: Disclosure
  cefDisc: Disclosure
  cecdDisc: Disclosure
  cpfDisc: Disclosure
  cpcdDisc: Disclosure
  dacdDisc: Disclosure
}

/** Presenter Component */
const HeaderPresenter: React.VFC<PresenterProps> = ({
  state: { contactInfoUserId },
  query: { me, contactInfo, searchUser },
  mutation: { signOut, editProfile, changeEmail, changePassword, deleteAccount },
  onSbOpen,
  suDisc,
  epfDisc,
  cefDisc,
  cecdDisc,
  cpfDisc,
  cpcdDisc,
  dacdDisc,
  ...props
}) => (
  <Flex {...styles.root} {...props}>
    <IconButton icon={<RiContactsLine />} {...styles.openButton} onClick={onSbOpen} />
    <AppLogo {...styles.logo} />
    <HStack {...styles.rightContents}>
      <IconButton icon={<ImSearch />} {...styles.searchButton} onClick={suDisc.onOpen} />
      <AccountMenu
        query={{ me }}
        mutation={{ signOut }}
        onEpfOpen={epfDisc.onOpen}
        onCefOpen={cefDisc.onOpen}
        onCpfOpen={cpfDisc.onOpen}
        onDadOpen={dacdDisc.onOpen}
      />
    </HStack>
    <EditProfileForm query={{ me }} mutation={{ editProfile }} isOpen={epfDisc.isOpen} onClose={epfDisc.onClose} />
    <ChangeEmailForm query={{ me }} mutation={{ changeEmail }} isOpen={cefDisc.isOpen} onClose={cefDisc.onClose} />
    <ChangeEmailCompleteDialog isOpen={cecdDisc.isOpen} onClose={cecdDisc.onClose} />
    <ChangePasswordForm mutation={{ changePassword }} isOpen={cpfDisc.isOpen} onClose={cpfDisc.onClose} />
    <ChangePasswordCompleteDialog isOpen={cpcdDisc.isOpen} onClose={cpcdDisc.onClose} />
    <DeleteAccountConfirmDialog mutation={{ deleteAccount }} isOpen={dacdDisc.isOpen} onClose={dacdDisc.onClose} />
    <SearchUser
      state={{ contactInfoUserId }}
      query={{ contactInfo, searchUser }}
      isOpen={suDisc.isOpen}
      onClose={suDisc.onClose}
    />
  </Flex>
)

/** Container Component */
const HeaderContainer: React.VFC<ContainerProps<HeaderProps, PresenterProps>> = ({
  presenter,
  query,
  mutation,
  ...props
}) => {
  // SearchUser modal
  const suDisc = useDisclosure()

  // EditProfile modal
  const epfDisc = useDisclosure()

  // ChangeEmail modal
  const { onOpen: onCefOpen, ...cefDiscRest } = useDisclosure()
  const cecdDisc = useDisclosure()
  const cefDisc = useMemo(() => {
    return {
      onOpen: () => {
        query.me.refetch()
        onCefOpen()
      },
      ...cefDiscRest
    }
  }, [onCefOpen, cefDiscRest, query.me])

  // ChangeEmail onComplete
  const onCefClose = cefDisc.onClose
  const onCecdOpen = cecdDisc.onOpen
  const changeEmailResult = mutation.changeEmail.result
  useMemo(() => {
    if (changeEmailResult) {
      onCefClose()
      onCecdOpen()
    }
  }, [onCefClose, onCecdOpen, changeEmailResult])

  // ChangePassword modal
  const cpfDisc = useDisclosure()
  const cpcdDisc = useDisclosure()

  // ChangePassword onComplete
  const onCpfClose = cpfDisc.onClose
  const onCpcdOpen = cpcdDisc.onOpen
  const changePasswordResult = mutation.changePassword.result
  useMemo(() => {
    if (changePasswordResult) {
      onCpfClose()
      onCpcdOpen()
    }
  }, [onCpfClose, onCpcdOpen, changePasswordResult])

  // DeleteAccountConfirmDialog modal
  const dacdDisc = useDisclosure()

  return presenter({
    query,
    mutation,
    suDisc,
    epfDisc,
    cefDisc,
    cecdDisc,
    cpfDisc,
    cpcdDisc,
    dacdDisc,
    ...props
  })
}

/** Header */
export default connect<HeaderProps, PresenterProps>('Header', HeaderPresenter, HeaderContainer)
