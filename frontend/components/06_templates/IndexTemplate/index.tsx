import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react'
import Header from 'components/04_organisms/Header'
import Main from 'components/04_organisms/Main'
import Sidebar from 'components/04_organisms/Sidebar'
import HtmlSkeleton, { Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import {
  ApplyContactMutation,
  ApplyContactMutationVariables,
  ApproveContactMutation,
  ApproveContactMutationVariables,
  BlockContactMutation,
  BlockContactMutationVariables,
  ChangeEmailMutation,
  ChangeEmailMutationVariables,
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
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
  SearchUserQuery,
  SearchUserQueryVariables,
  SendImageMutation,
  SendImageMutationVariables,
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
  ContactInfoUserId,
  ContainerProps,
  Disclosure,
  LazyQueryFunction,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus,
  QueryRefetch,
  SetContactInfoUserId,
  ValidationErrors
} from 'types'
import * as styles from './styles'

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
     * ユーザー情報
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
     * 画像送信
     */
    sendImage: {
      result?: SendImageMutation['sendImage']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<SendImageMutation, SendImageMutationVariables>
    }
    /**
     * メッセージ削除
     */
    deleteMessage: {
      result?: DeleteMessageMutation['deleteMessage']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
    /**
     * コンタクト申請
     */
    applyContact: {
      result?: ApplyContactMutation['applyContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ApplyContactMutation, ApplyContactMutationVariables>
    }
    /**
     * コンタクト承認
     */
    approveContact: {
      result?: ApproveContactMutation['approveContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ApproveContactMutation, ApproveContactMutationVariables>
    }
    /**
     * コンタクト削除
     */
    deleteContact: {
      result?: DeleteContactMutation['deleteContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<DeleteContactMutation, DeleteContactMutationVariables>
    }
    /**
     * コンタクト削除取消
     */
    undeleteContact: {
      result?: UndeleteContactMutation['undeleteContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<UndeleteContactMutation, UndeleteContactMutationVariables>
    }
    /**
     * コンタクトブロック
     */
    blockContact: {
      result?: BlockContactMutation['blockContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<BlockContactMutation, BlockContactMutationVariables>
    }
    /**
     * コンタクトブロック解除
     */
    unblockContact: {
      result?: UnblockContactMutation['unblockContact']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<UnblockContactMutation, UnblockContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = IndexTemplateProps & {
  sbDisc: Disclosure
}

/** Presenter Component */
const IndexTemplatePresenter: React.VFC<PresenterProps> = ({
  state,
  query: { me, contacts, latestMessages, contactInfo, searchUser },
  mutation: {
    signOut,
    editProfile,
    changeEmail,
    changePassword,
    deleteAccount,
    sendMessage,
    sendImage,
    deleteMessage,
    applyContact,
    approveContact,
    deleteContact,
    undeleteContact,
    blockContact,
    unblockContact
  },
  sbDisc
}) => (
  <HtmlSkeleton>
    <Title>Home</Title>
    <Box minH='100vh'>
      <Sidebar
        {...styles.mdSidebar}
        state={state}
        query={{ me, contacts, latestMessages, contactInfo }}
        onClose={sbDisc.onClose}
      />
      <Drawer {...styles.drawer} isOpen={sbDisc.isOpen} onClose={sbDisc.onClose} onOverlayClick={sbDisc.onClose}>
        <DrawerContent>
          <Sidebar state={state} query={{ me, contacts, latestMessages, contactInfo }} onClose={sbDisc.onClose} />
        </DrawerContent>
      </Drawer>
      <Header
        onSbOpen={sbDisc.onOpen}
        state={state}
        query={{ me, contactInfo, searchUser }}
        mutation={{ signOut, editProfile, changeEmail, changePassword, deleteAccount }}
      />
      <Main
        query={{ me, contactInfo }}
        mutation={{
          sendMessage,
          sendImage,
          deleteMessage,
          applyContact,
          approveContact,
          deleteContact,
          undeleteContact,
          blockContact,
          unblockContact
        }}
      />
    </Box>
  </HtmlSkeleton>
)

/** Container Component */
const IndexTemplateContainer: React.VFC<ContainerProps<IndexTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  // Sidebar
  const sbDisc = useDisclosure()
  return presenter({ sbDisc, ...props })
}

/** IndexTemplate */
export default connect<IndexTemplateProps, PresenterProps>(
  'IndexTemplate',
  IndexTemplatePresenter,
  IndexTemplateContainer
)
