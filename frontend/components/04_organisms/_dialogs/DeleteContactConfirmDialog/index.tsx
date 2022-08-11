import { ButtonProps } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import ConfirmDialog, { ConfirmDialogProps } from 'components/03_molecules/ConfirmDialog'
import { connect } from 'components/hoc'
import { ContactInfoQuery, DeleteContactMutation, DeleteContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction } from 'types'
import { toStr } from 'utils/general/helper'

/** DeleteContactConfirmDialog Props */
export type DeleteContactConfirmDialogProps = Omit<
  ConfirmDialogProps,
  'children' | 'header' | 'body' | 'ok' | 'cancel'
> & {
  /**
   * Query
   */
  query: {
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
     * コンタクト削除
     */
    deleteContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<DeleteContactMutation, DeleteContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<DeleteContactConfirmDialogProps, 'query' | 'mutation'> & {
  loading: MutaionLoading
  onOkButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const DeleteContactConfirmDialogPresenter: React.VFC<PresenterProps> = ({
  loading,
  onClose,
  onOkButtonClick,
  ...props
}) => (
  <ConfirmDialog
    header='Delete Contact'
    body='Do you want to delete this contact?'
    ok={{ w: 'full', colorScheme: 'red', children: 'OK', isLoading: loading, onClick: onOkButtonClick }}
    cancel={{ w: 'full', children: 'Cancel', isDisabled: loading, onClick: onClose }}
    {...{ onClose, ...props }}
  />
)

/** Container Component */
const DeleteContactConfirmDialogContainer: React.VFC<
  ContainerProps<DeleteContactConfirmDialogProps, PresenterProps>
> = ({ presenter, query: { contactInfo }, mutation: { deleteContact }, ...props }) => {
  const loading = deleteContact.loading
  const onOkButtonClick = () => {
    const contactId = toStr(contactInfo.result?.id)
    deleteContact.reset()
    deleteContact.mutate({ variables: { contactId } }).catch(toast('UnexpectedError'))
  }
  return presenter({ loading, onOkButtonClick, ...props })
}

/** DeleteContactConfirmDialog */
export default connect<DeleteContactConfirmDialogProps, PresenterProps>(
  'DeleteContactConfirmDialog',
  DeleteContactConfirmDialogPresenter,
  DeleteContactConfirmDialogContainer
)
