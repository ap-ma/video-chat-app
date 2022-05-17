import { Flex, FlexProps, HStack, IconButton, useDisclosure } from '@chakra-ui/react'
import AppLogo from 'components/01_atoms/AppLogo'
import AccountMenu from 'components/04_organisms/AccountMenu'
import ChangePasswordCompleteDialog from 'components/04_organisms/dialogs/ChangePasswordCompleteDialog'
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
  ValidationErrors
} from 'types'
import * as styles from './styles'

/** Header Props */
export type HeaderProps = Omit<FlexProps, 'me'> & {
  /**
   * サインインユーザー情報
   */
  me?: MeQuery['me']
  /**
   * サイドバー onOpen
   */
  onSbOpen: OnOpen
  /**
   * ユーザー検索 onOpen
   */
  onSuOpen: OnOpen
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
  // EditProfile
  isEpfOpen: IsOpen
  onEpfOpen: OnOpen
  onEpfClose: OnClose
  // ChangeEmail
  isCefOpen: IsOpen
  onCefOpen: OnOpen
  onCefClose: OnClose
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
  me,
  mutation: { signOut, editProfile, changeEmail, changePassword, deleteAccount },
  // sidebar
  onSbOpen,
  onSuOpen,
  // EditProfile
  isEpfOpen,
  onEpfOpen,
  onEpfClose,
  // ChangeEmail
  isCefOpen,
  onCefOpen,
  onCefClose,
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
      <AccountMenu mutation={{ signOut }} {...{ me, onEpfOpen, onCefOpen, onCpfOpen, onDadOpen }} />
    </HStack>
    <EditProfileForm me={me} mutation={{ editProfile }} isOpen={isEpfOpen} onClose={onEpfClose} />
    <ChangePasswordForm mutation={{ changePassword }} isOpen={isCpfOpen} onClose={onCpfClose} />
    <ChangePasswordCompleteDialog isOpen={isCpdOpen} onClose={onCpdClose} />
  </Flex>
)

/** Container Component */
const HeaderContainer: React.VFC<ContainerProps<HeaderProps, PresenterProps>> = ({ presenter, mutation, ...props }) => {
  // EditProfileForm
  const { isOpen: isEpfOpen, onOpen: onEpfOpen, onClose: onEpfClose } = useDisclosure()

  // ChangeEmailForm
  const { isOpen: isCefOpen, onOpen: onCefOpen, onClose: onCefClose } = useDisclosure()

  // ChangePasswordForm
  const { isOpen: isCpfOpen, onOpen: onCpfOpen, onClose: onCpfClose } = useDisclosure()
  const { isOpen: isCpdOpen, onOpen: onCpdOpen, onClose: onCpdClose } = useDisclosure()
  // change password 完了時
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
    mutation,
    // EditProfile
    isEpfOpen,
    onEpfOpen,
    onEpfClose,
    // ChangeEmail
    isCefOpen,
    onCefOpen,
    onCefClose,
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
