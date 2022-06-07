import { ButtonProps } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import ConfirmDialog, { ConfirmDialogProps } from 'components/03_molecules/ConfirmDialog'
import { connect } from 'components/hoc'
import { MESSAGE } from 'const'
import { ApproveContactMutation, ApproveContactMutationVariables, ContactInfoQuery, MeQuery } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction } from 'types'
import { isNullish } from 'utils/general/object'
import * as styles from './styles'

/** ApproveContactConfirmDialog Props */
export type ApproveContactConfirmDialogProps = Omit<
  ConfirmDialogProps,
  'children' | 'header' | 'body' | 'ok' | 'cancel'
> & {
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
     *  コンタクト情報
     */
    contactInfo: {
      result?: ContactInfoQuery['contactInfo']
    }
  }
  /**
   * Mutation
   */
  mutation: {
    /**
     * コンタクト削除取消
     */
    approveContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<ApproveContactMutation, ApproveContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ApproveContactConfirmDialogProps, 'query' | 'mutation'> & {
  loading: MutaionLoading
  onOkButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const ApproveContactConfirmDialogPresenter: React.VFC<PresenterProps> = ({
  loading,
  onClose,
  onOkButtonClick,
  ...props
}) => (
  <ConfirmDialog
    header='Approve Contact'
    body='Do you approve the contact?'
    ok={{ ...styles.ok, children: 'OK', isLoading: loading, onClick: onOkButtonClick }}
    cancel={{ w: 'full', children: 'Cancel', isDisabled: loading, onClick: onClose }}
    {...{ onClose, ...props }}
  />
)

/** Container Component */
const ApproveContactConfirmDialogContainer: React.VFC<
  ContainerProps<ApproveContactConfirmDialogProps, PresenterProps>
> = ({ presenter, onClose, query: { me, contactInfo }, mutation: { approveContact }, ...props }) => {
  const loading = approveContact.loading
  const onOkButtonClick = () => {
    // contact application
    const applicationMessage = contactInfo.result?.chat.reverse().find((message) => {
      const isApplicationMessage = MESSAGE.CATEGORY.CONTACT_APPLICATION === message.category
      const isReceivedMessage = me.result?.id === message.rxUserId
      return isApplicationMessage && isReceivedMessage
    })

    if (isNullish(applicationMessage)) {
      toast('UnexpectedError')
      onClose()
      return
    }

    // mutate
    approveContact.reset()
    approveContact.mutate({ variables: { messageId: applicationMessage.id } }).catch(toast('UnexpectedError'))
  }

  return presenter({
    onClose,
    loading,
    onOkButtonClick,
    ...props
  })
}

/** ApproveContactConfirmDialog */
export default connect<ApproveContactConfirmDialogProps, PresenterProps>(
  'ApproveContactConfirmDialog',
  ApproveContactConfirmDialogPresenter,
  ApproveContactConfirmDialogContainer
)
