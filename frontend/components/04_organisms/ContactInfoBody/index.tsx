import Chat from 'components/04_organisms/Chat'
import ApplyContactBox from 'components/04_organisms/_boxes/ApplyContactBox'
import ApproveContactBox from 'components/04_organisms/_boxes/ApproveContactBox'
import UnblockContactBox from 'components/04_organisms/_boxes/UnblockContactBox'
import { connect } from 'components/hoc'
import { CONTACT, MESSAGE } from 'const'
import {
  ApplyContactMutation,
  ApplyContactMutationVariables,
  ApproveContactMutation,
  ApproveContactMutationVariables,
  ContactInfoQuery,
  ContactInfoQueryVariables,
  DeleteMessageMutation,
  DeleteMessageMutationVariables,
  MeQuery,
  UnblockContactMutation,
  UnblockContactMutationVariables
} from 'graphql/generated'
import React, { Fragment } from 'react'
import {
  ContainerProps,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus
} from 'types'
import { isBlank } from 'utils/general/object'
import * as styles from './styles'

/** ContactInfoBody Props */
export type ContactInfoBodyProps = {
  /**
   * Query
   */
  query: {
    /**
     * ユーザー情報
     */
    me: {
      result?: MeQuery['me']
    }
    /**
     *  コンタクト情報
     */
    contactInfo: {
      result?: ContactInfoQuery['contactInfo']
      loading: QueryLoading
      networkStatus: QueryNetworkStatus
      fetchMore: QueryFetchMore<ContactInfoQuery, ContactInfoQueryVariables>
    }
  }
  /**
   * Mutation
   */
  mutation: {
    /**
     * メッセージ削除
     */
    deleteMessage: {
      result?: DeleteMessageMutation['deleteMessage']
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
    /**
     * コンタクト申請
     */
    applyContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<ApplyContactMutation, ApplyContactMutationVariables>
    }
    /**
     * コンタクト承認
     */
    approveContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<ApproveContactMutation, ApproveContactMutationVariables>
    }
    /**
     * コンタクトブロック解除
     */
    unblockContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<UnblockContactMutation, UnblockContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = ContactInfoBodyProps & {
  chatDisp: boolean
  applyBoxDisp: boolean
  approveBoxDisp: boolean
  unblockBoxDisp: boolean
}

/** Presenter Component */
const ContactInfoBodyPresenter: React.VFC<PresenterProps> = ({
  query: { me, contactInfo },
  mutation: { deleteMessage, applyContact, approveContact, unblockContact },
  chatDisp,
  applyBoxDisp,
  approveBoxDisp,
  unblockBoxDisp
}) => (
  <Fragment>
    <Chat {...styles.chat({ chatDisp })} query={{ me, contactInfo }} mutation={{ deleteMessage }} />
    <ApplyContactBox
      {...styles.applyContactBox({ applyBoxDisp })}
      query={{ contactInfo }}
      mutation={{ applyContact }}
    />
    <ApproveContactBox
      {...styles.approveContactBox({ approveBoxDisp })}
      query={{ me, contactInfo }}
      mutation={{ approveContact }}
    />
    <UnblockContactBox
      {...styles.unblockContactBox({ unblockBoxDisp })}
      query={{ contactInfo }}
      mutation={{ unblockContact }}
    />
  </Fragment>
)

/** Container Component */
const ContactInfoBodyContainer: React.VFC<ContainerProps<ContactInfoBodyProps, PresenterProps>> = ({
  presenter,
  query: { me, contactInfo },
  ...props
}) => {
  const unapproved = CONTACT.STATUS.UNAPPROVED === contactInfo.result?.status
  const chat = contactInfo.result?.chat

  // display flag
  const unblockBoxDisp = !!contactInfo.result?.blocked
  const applyBoxDisp = !unblockBoxDisp && unapproved && isBlank(chat)
  const approveBoxDisp =
    !unblockBoxDisp &&
    unapproved &&
    !!chat?.some((message) => {
      const isApplicationMessage = MESSAGE.CATEGORY.CONTACT_APPLICATION === message.category
      const isReceivedMessage = me.result?.id === message.rxUserId
      return isApplicationMessage && isReceivedMessage
    })
  const chatDisp = !unblockBoxDisp && !applyBoxDisp && !approveBoxDisp

  return presenter({
    query: { me, contactInfo },
    chatDisp,
    applyBoxDisp,
    approveBoxDisp,
    unblockBoxDisp,
    ...props
  })
}

/** ContactInfoBody */
export default connect<ContactInfoBodyProps, PresenterProps>(
  'ContactInfoBody',
  ContactInfoBodyPresenter,
  ContactInfoBodyContainer
)
