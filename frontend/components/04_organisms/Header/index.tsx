import { Flex, FlexProps, HStack, IconButton, useDisclosure } from '@chakra-ui/react'
import AppLogo from 'components/01_atoms/AppLogo'
import AccountMenu from 'components/04_organisms/AccountMenu'
import ChangeEmailCompleteDialog from 'components/04_organisms/dialogs/ChangeEmailCompleteDialog'
import ChangePasswordCompleteDialog from 'components/04_organisms/dialogs/ChangePasswordCompleteDialog'
import ChangeEmailForm from 'components/04_organisms/forms/ChangeEmailForm'
import ChangePasswordForm from 'components/04_organisms/forms/ChangePasswordForm'
import EditProfileForm from 'components/04_organisms/forms/EditProfileForm'
import { connect } from 'components/hoc'
import {
  ChangeEmailMutation,
  ChangeEmailMutationVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  EditProfileMutation,
  EditProfileMutationVariables,
  MeQuery,
  MeQueryVariables,
  SignOutMutation,
  SignOutMutationVariables
} from 'graphql/generated'
import React, { useMemo } from 'react'
import { ImSearch } from 'react-icons/im'
import { RiContactsLine } from 'react-icons/ri'
import {
  ContainerProps,
  IsOpen,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  OnClose,
  OnOpen,
  QueryLoading,
  QueryRefetch,
  ValidationErrors
} from 'types'
import * as styles from './styles'

/** Header Props */
export type HeaderProps = Omit<FlexProps, 'me'> & {
  /**
   * サイドバー onOpen
   */
  onSbOpen: OnOpen
  /**
   * Query
   */
  query: {
    /**
     * サインインユーザー情報
     */
    me: {
      result?: MeQuery['me']
      loading: QueryLoading
      refetch: QueryRefetch<MeQuery, MeQueryVariables>
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
  // SearchUser
  isSuOpen: IsOpen
  onSuOpen: OnOpen
  onSuClose: OnClose
  // EditProfile
  isEpfOpen: IsOpen
  onEpfOpen: OnOpen
  onEpfClose: OnClose
  // ChangeEmail
  isCefOpen: IsOpen
  onCefOpen: OnOpen
  onCefClose: OnClose
  isCedOpen: IsOpen
  onCedClose: OnClose
  // ChangePassword
  isCpfOpen: IsOpen
  onCpfOpen: OnOpen
  onCpfClose: OnClose
  isCpdOpen: IsOpen
  onCpdClose: OnClose
  // DeleteAccount
  isDadOpen: IsOpen
  onDadOpen: OnOpen
  onDadClose: OnClose
}

/** Presenter Component */
const HeaderPresenter: React.VFC<PresenterProps> = ({
  query: { me },
  mutation: { signOut, editProfile, changeEmail, changePassword, deleteAccount },
  // sidebar
  onSbOpen,
  // SearchUser
  isSuOpen,
  onSuOpen,
  onSuClose,
  // EditProfile
  isEpfOpen,
  onEpfOpen,
  onEpfClose,
  // ChangeEmail
  isCefOpen,
  onCefOpen,
  onCefClose,
  isCedOpen,
  onCedClose,
  // ChangePassword
  isCpfOpen,
  onCpfOpen,
  onCpfClose,
  isCpdOpen,
  onCpdClose,
  // DeleteAccount
  isDadOpen,
  onDadOpen,
  onDadClose,
  ...props
}) => (
  <Flex {...styles.root} {...props}>
    <IconButton icon={<RiContactsLine />} {...styles.openButton} onClick={onSbOpen} />
    <AppLogo {...styles.logo} />
    <HStack {...styles.rightContents}>
      <IconButton icon={<ImSearch />} {...styles.searchButton} onClick={onSuOpen} />
      <AccountMenu query={{ me }} mutation={{ signOut }} {...{ onEpfOpen, onCefOpen, onCpfOpen, onDadOpen }} />
    </HStack>
    <EditProfileForm query={{ me }} mutation={{ editProfile }} isOpen={isEpfOpen} onClose={onEpfClose} />
    <ChangeEmailForm query={{ me }} mutation={{ changeEmail }} isOpen={isCefOpen} onClose={onCefClose} />
    <ChangeEmailCompleteDialog isOpen={isCedOpen} onClose={onCedClose} />
    <ChangePasswordForm mutation={{ changePassword }} isOpen={isCpfOpen} onClose={onCpfClose} />
    <ChangePasswordCompleteDialog isOpen={isCpdOpen} onClose={onCpdClose} />
  </Flex>
)

/** Container Component */
const HeaderContainer: React.VFC<ContainerProps<HeaderProps, PresenterProps>> = ({
  presenter,
  query,
  mutation,
  ...props
}) => {
  // SearchUser
  const { isOpen: isSuOpen, onOpen: onSuOpen, onClose: onSuClose } = useDisclosure()

  // EditProfileForm
  const { isOpen: isEpfOpen, onOpen: onEpfOpen, onClose: onEpfClose } = useDisclosure()

  // ChangeEmail
  const { isOpen: isCefOpen, onOpen: onChangeEmailFormOpen, onClose: onCefClose } = useDisclosure()
  const { isOpen: isCedOpen, onOpen: onCedOpen, onClose: onCedClose } = useDisclosure()
  const onCefOpen = () => {
    query.me.refetch()
    onChangeEmailFormOpen()
  }
  // ChangeEmail 完了時
  useMemo(() => {
    if (mutation.changeEmail.result) {
      onCefClose()
      onCedOpen()
      mutation.changeEmail.reset()
    }
  }, [onCefClose, onCedOpen, mutation.changeEmail])

  // ChangePassword
  const { isOpen: isCpfOpen, onOpen: onCpfOpen, onClose: onCpfClose } = useDisclosure()
  const { isOpen: isCpdOpen, onOpen: onCpdOpen, onClose: onCpdClose } = useDisclosure()
  // ChangePassword 完了時
  useMemo(() => {
    if (mutation.changePassword.result) {
      onCpfClose()
      onCpdOpen()
      mutation.changePassword.reset()
    }
  }, [onCpfClose, onCpdOpen, mutation.changePassword])

  // DeleteAccountDialog
  const { isOpen: isDadOpen, onOpen: onDadOpen, onClose: onDadClose } = useDisclosure()

  return presenter({
    query,
    mutation,
    // SearchUser
    isSuOpen,
    onSuOpen,
    onSuClose,
    // EditProfile
    isEpfOpen,
    onEpfOpen,
    onEpfClose,
    // ChangeEmail
    isCefOpen,
    onCefOpen,
    onCefClose,
    isCedOpen,
    onCedClose,
    // ChangePassword
    isCpfOpen,
    onCpfOpen,
    onCpfClose,
    isCpdOpen,
    onCpdClose,
    // DeleteAccount
    isDadOpen,
    onDadOpen,
    onDadClose,
    ...props
  })
}

/** Header */
export default connect<HeaderProps, PresenterProps>('Header', HeaderPresenter, HeaderContainer)
