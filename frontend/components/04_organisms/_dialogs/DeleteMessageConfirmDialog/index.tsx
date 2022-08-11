import { ButtonProps } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import ConfirmDialog, { ConfirmDialogProps } from 'components/03_molecules/ConfirmDialog'
import { connect } from 'components/hoc'
import { DeleteMessageMutation, DeleteMessageMutationVariables } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction } from 'types'
import { toStr } from 'utils/general/helper'

/** DeleteMessageConfirmDialog Props */
export type DeleteMessageConfirmDialogProps = Omit<
  ConfirmDialogProps,
  'children' | 'header' | 'body' | 'ok' | 'cancel'
> & {
  /**
   *  メッセージID
   */
  messageId?: string
  /**
   * Mutation
   */
  mutation: {
    /**
     * メッセージ削除
     */
    deleteMessage: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<DeleteMessageConfirmDialogProps, 'message' | 'mutation'> & {
  loading: MutaionLoading
  onOkButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const DeleteMessageConfirmDialogPresenter: React.VFC<PresenterProps> = ({
  loading,
  onClose,
  onOkButtonClick,
  ...props
}) => (
  <ConfirmDialog
    header='Delete Message'
    body='Do you want to delete this message?'
    ok={{ w: 'full', colorScheme: 'red', children: 'OK', isLoading: loading, onClick: onOkButtonClick }}
    cancel={{ w: 'full', children: 'Cancel', isDisabled: loading, onClick: onClose }}
    {...{ onClose, ...props }}
  />
)

/** Container Component */
const DeleteMessageConfirmDialogContainer: React.VFC<
  ContainerProps<DeleteMessageConfirmDialogProps, PresenterProps>
> = ({ presenter, messageId, mutation: { deleteMessage }, ...props }) => {
  const loading = deleteMessage.loading
  const onOkButtonClick = () => {
    deleteMessage.reset()
    deleteMessage.mutate({ variables: { messageId: toStr(messageId) } }).catch(toast('UnexpectedError'))
  }
  return presenter({ loading, onOkButtonClick, ...props })
}

/** DeleteMessageConfirmDialog */
export default connect<DeleteMessageConfirmDialogProps, PresenterProps>(
  'DeleteMessageConfirmDialog',
  DeleteMessageConfirmDialogPresenter,
  DeleteMessageConfirmDialogContainer
)
