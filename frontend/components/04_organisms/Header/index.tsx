import { Flex, FlexProps, HStack, IconButton, useDisclosure } from '@chakra-ui/react'
import AppLogo from 'components/01_atoms/AppLogo'
import AccountMenu from 'components/04_organisms/AccountMenu'
import { connect } from 'components/hoc'
import { MeQuery, SignOutMutation, SignOutMutationVariables } from 'graphql/generated'
import React from 'react'
import { ImSearch } from 'react-icons/im'
import { RiContactsLine } from 'react-icons/ri'
import { ContainerProps, IsOpen, MutaionLoading, MutateFunction, OnClose, OnOpen } from 'types'
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
  // DeleteAccount
  isDadOpen: IsOpen
  onDadOpen: OnOpen
  onDadClose: OnClose
}

/** Presenter Component */
const HeaderPresenter: React.VFC<PresenterProps> = ({
  me,
  mutation: { signOut },
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
  </Flex>
)

/** Container Component */
const HeaderContainer: React.VFC<ContainerProps<HeaderProps, PresenterProps>> = ({ presenter, ...props }) => {
  // EditProfileForm
  const { isOpen: isEpfOpen, onOpen: onEpfOpen, onClose: onEpfClose } = useDisclosure()
  // ChangeEmailForm
  const { isOpen: isCefOpen, onOpen: onCefOpen, onClose: onCefClose } = useDisclosure()
  // ChangePasswordForm
  const { isOpen: isCpfOpen, onOpen: onCpfOpen, onClose: onCpfClose } = useDisclosure()
  // DeleteAccountDialog
  const { isOpen: isDadOpen, onOpen: onDadOpen, onClose: onDadClose } = useDisclosure()

  return presenter({
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
    // DeleteAccount
    isDadOpen,
    onDadOpen,
    onDadClose,
    ...props
  })
}

/** Header */
export default connect<HeaderProps, PresenterProps>('Header', HeaderPresenter, HeaderContainer)
