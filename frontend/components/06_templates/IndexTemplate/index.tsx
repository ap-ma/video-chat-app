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
  ContactsQueryVariables,
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  DeleteContactMutation,
  DeleteContactMutationVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  EditProfileMutation,
  EditProfileMutationVariables,
  LatestMessagesQuery,
  LatestMessagesQueryVariables,
  MeQuery,
  MeQueryVariables,
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
      loading: QueryLoading
      refetch: QueryRefetch<MeQuery, MeQueryVariables>
    }
    /**
     * コンタクト一覧
     */
    contacts: {
      result?: ContactsQuery['contacts']
      loading: QueryLoading
      refetch: QueryRefetch<ContactsQuery, ContactsQueryVariables>
    }
    /**
     * メッセージ一覧
     */
    latestMessages: {
      result?: LatestMessagesQuery['latestMessages']
      loading: QueryLoading
      refetch: QueryRefetch<LatestMessagesQuery, LatestMessagesQueryVariables>
    }
    /**
     *  コンタクト情報
     */
    contactInfo: {
      result?: ContactInfoQuery['contactInfo']
      loading: QueryLoading
      networkStatus: QueryNetworkStatus
      refetch: QueryRefetch<ContactInfoQuery, ContactInfoQueryVariables>
      fetchMore: QueryFetchMore<ContactInfoQuery, ContactInfoQueryVariables>
    }
    /**
     * ユーザー検索
     */
    searchUser: {
      result?: SearchUserQuery['searchUser']
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
}

/** Presenter Component */
const IndexTemplatePresenter: React.VFC<PresenterProps> = ({
  state,
  query: { me, contacts, latestMessages, contactInfo, searchUser },
  mutation: { signOut, editProfile, changeEmail, changePassword, deleteAccount },
  // Sidebar
  isSbOpen,
  onSbOpen,
  onSbClose,
  ...props
}) => (
  <HtmlSkeleton>
    <Title>Home</Title>
    <Box minH='100vh' bg='gray.100'>
      <Sidebar
        display={{ base: 'none', md: 'block' }}
        query={{ me, contacts, latestMessages, contactInfo }}
        {...{ onSbClose, state }}
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
          <Sidebar query={{ me, contacts, latestMessages, contactInfo }} {...{ onSbClose, state }} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <Header
        onSbOpen={onSbOpen}
        query={{ me }}
        mutation={{ signOut, editProfile, changeEmail, changePassword, deleteAccount }}
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

  return presenter({
    // Sidebar
    isSbOpen,
    onSbOpen,
    onSbClose,
    ...props
  })
}

/** IndexTemplate */
export default connect<IndexTemplateProps, PresenterProps>(
  'IndexTemplate',
  IndexTemplatePresenter,
  IndexTemplateContainer
)
