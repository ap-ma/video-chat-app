import { ButtonProps } from '@chakra-ui/react'
import ConfirmDialog, { ConfirmDialogProps } from 'components/03_molecules/ConfirmDialog'
import { connect } from 'components/hoc'
import { DeleteAccountMutation, DeleteAccountMutationVariables } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutateFunction } from 'types'

/** DeleteAccountConfirmDialog Props */
export type DeleteAccountConfirmDialogProps = Omit<
  ConfirmDialogProps,
  'children' | 'header' | 'body' | 'ok' | 'cancel'
> & {
  /**
   * Mutation
   */
  mutation: {
    /**
     * アカウント削除
     */
    deleteAccount: {
      loading: MutaionLoading
      mutate: MutateFunction<DeleteAccountMutation, DeleteAccountMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<DeleteAccountConfirmDialogProps, 'mutation'> & {
  loading: MutaionLoading
  onDeleteButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const DeleteAccountConfirmDialogPresenter: React.VFC<PresenterProps> = ({
  loading,
  onClose,
  onDeleteButtonClick,
  ...props
}) => (
  <ConfirmDialog
    header='Delete Account'
    body={['Do you want to delete your account?', 'This operation cannot be undone.']}
    ok={{ colorScheme: 'red', children: 'Delete', isLoading: loading, onClick: onDeleteButtonClick }}
    cancel={{ children: 'Cancel', isDisabled: loading, onClick: onClose }}
    {...{ onClose, ...props }}
  />
)

/** Container Component */
const DeleteAccountConfirmDialogContainer: React.VFC<
  ContainerProps<DeleteAccountConfirmDialogProps, PresenterProps>
> = ({ presenter, mutation: { deleteAccount }, ...props }) => {
  const loading = deleteAccount.loading
  const onDeleteButtonClick = () => deleteAccount.mutate()
  return presenter({ loading, onDeleteButtonClick, ...props })
}

/** DeleteAccountConfirmDialog */
export default connect<DeleteAccountConfirmDialogProps, PresenterProps>(
  'DeleteAccountConfirmDialog',
  DeleteAccountConfirmDialogPresenter,
  DeleteAccountConfirmDialogContainer
)
