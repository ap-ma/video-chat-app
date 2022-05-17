import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react'
import Header from 'components/04_organisms/Header'
import Sidebar from 'components/04_organisms/Sidebar'
import HtmlSkeleton, { Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import {
  BlockContactMutation,
  BlockContactMutationVariables,
  ChangeEmailMutation,
  ChangeEmailMutationVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
  ContactApplicationMutation,
  ContactApplicationMutationVariables,
  ContactApprovalMutation,
  ContactApprovalMutationVariables,
  ContactInfoQuery,
  ContactInfoQueryVariables,
  ContactsQuery,
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  DeleteContactMutation,
  DeleteContactMutationVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  EditProfileMutation,
  EditProfileMutationVariables,
  LatestMessagesQuery,
  MeQuery,
  ReadMessagesMutation,
  ReadMessagesMutationVariables,
  SearchUserQuery,
  SearchUserQueryVariables,
  SendMessageMutation,
  SendMessageMutationVariables,
  SignOutMutation,
  SignOutMutationVariables,
  UnblockContactMutation,
  UnblockContactMutationVariables,
  UndeleteContactMutation,
  UndeleteContactMutationVariables
} from 'graphql/generated'
import React from 'react'
import {
  ContainerProps,
  IsOpen,
  LazyQueryFunction,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  OnClose,
  OnOpen,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  QueryRefetch,
  ValidationErrors
} from 'types'
import { ContactInfoUserId, SetContactInfoUserId } from 'utils/apollo/state'

/** IndexTemplate Props */
export type IndexTemplateProps = {
  /**
   * サインインユーザー情報
   */
  me?: MeQuery['me']
  /**
   * コンタクト一覧
   */
  contacts?: ContactsQuery['contacts']
  /**
   * メッセージ一覧
   */
  latestMessages?: LatestMessagesQuery['latestMessages']
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
      contactInfo?: ContactInfoQuery['contactInfo']
      loading: QueryLoading
      networkStatus: QueryNetworkStatus
      refetch: QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
      fetchMore: QueryFetchMore<ContactInfoQuery, ContactInfoQueryVariables>
    }
    /**
     * ユーザー検索
     */
    searchUser: {
      users?: SearchUserQuery['searchUser']
      loading: QueryLoading
      getUsersByCode: LazyQueryFunction<SearchUserQuery, SearchUserQueryVariables>
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
      result?: SignOutMutation['signOut']
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
    /**
     * メッセージ送信
     */
    sendMessage: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<SendMessageMutation, SendMessageMutationVariables>
    }
    /**
     * メッセージ削除
     */
    deleteMessage: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
    /**
     * メッセージ既読
     */
    readMessages: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ReadMessagesMutation, ReadMessagesMutationVariables>
    }
    /**
     * コンタクト申請
     */
    contactApplication: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ContactApplicationMutation, ContactApplicationMutationVariables>
    }
    /**
     * コンタクト承認
     */
    contactApproval: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ContactApprovalMutation, ContactApprovalMutationVariables>
    }
    /**
     * コンタクト削除
     */
    deleteContact: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<DeleteContactMutation, DeleteContactMutationVariables>
    }
    /**
     * コンタクト削除取消
     */
    undeleteContact: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<UndeleteContactMutation, UndeleteContactMutationVariables>
    }
    /**
     * コンタクトブロック
     */
    blockContact: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<BlockContactMutation, BlockContactMutationVariables>
    }
    /**
     * コンタクトブロック解除
     */
    unblockContact: {
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<UnblockContactMutation, UnblockContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = IndexTemplateProps & {
  // Sidebar
  isSbOpen: IsOpen
  onSbOpen: OnOpen
  onSbClose: OnClose
  // SearchUser
  isSuOpen: IsOpen
  onSuOpen: OnOpen
  onSuClose: OnClose
}

/** Presenter Component */
const IndexTemplatePresenter: React.VFC<PresenterProps> = ({
  me,
  contacts,
  latestMessages,
  state,
  query: { contactInfo, searchUser },
  mutation: { signOut, editProfile, changeEmail, changePassword, deleteAccount },
  // Sidebar
  isSbOpen,
  onSbOpen,
  onSbClose,
  // SearchUser
  isSuOpen,
  onSuOpen,
  onSuClose,
  ...props
}) => (
  <HtmlSkeleton>
    <Title>Home</Title>
    <Box minH='100vh' bg='gray.100'>
      <Sidebar
        display={{ base: 'none', md: 'block' }}
        query={{ contactInfo }}
        {...{ me, contacts, latestMessages, onSbClose, state }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isSbOpen}
        placement='left'
        onClose={onSbClose}
        onOverlayClick={onSbClose}
        returnFocusOnClose={false}
        size='full'
      >
        <DrawerContent>
          <Sidebar query={{ contactInfo }} {...{ me, contacts, latestMessages, onSbClose, state }} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <Header
        mutation={{ signOut, editProfile, changeEmail, changePassword, deleteAccount }}
        {...{ me, onSbOpen, onSuOpen }}
      />
      <Box ml={{ base: 0, md: 72 }} p='4'>
        HOME
      </Box>
    </Box>
  </HtmlSkeleton>
)

/** Container Component */
const IndexTemplateContainer: React.VFC<ContainerProps<IndexTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  // Sidebar
  const { isOpen: isSbOpen, onOpen: onSbOpen, onClose: onSbClose } = useDisclosure()
  // SearchUser
  const { isOpen: isSuOpen, onOpen: onSuOpen, onClose: onSuClose } = useDisclosure()

  return presenter({
    // Sidebar
    isSbOpen,
    onSbOpen,
    onSbClose,
    // SearchUser
    isSuOpen,
    onSuOpen,
    onSuClose,
    ...props
  })
}

/** IndexTemplate */
export default connect<IndexTemplateProps, PresenterProps>(
  'IndexTemplate',
  IndexTemplatePresenter,
  IndexTemplateContainer
)
