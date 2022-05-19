import { ButtonProps } from '@chakra-ui/react'
import ConfirmDialog, { ConfirmDialogProps } from 'components/03_molecules/ConfirmDialog'
import { connect } from 'components/hoc'
import { DeleteAccountMutation, DeleteAccountMutationVariables } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutateFunction } from 'types'

/** DeleteAccountDialog Props */
export type DeleteAccountDialogProps = Omit<ConfirmDialogProps, 'children' | 'header' | 'body' | 'ok' | 'cancel'> & {
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
export type PresenterProps = Omit<DeleteAccountDialogProps, 'mutation'> & {
  loading: MutaionLoading
  onDeleteButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const DeleteAccountDialogPresenter: React.VFC<PresenterProps> = ({
  loading,
  onClose,
  onDeleteButtonClick,
  ...props
}) => (
  <ConfirmDialog
    header='Delete Account'
    body={['Do you want to delete your account?', 'This operation cannot be undone.']}
    ok={{ children: 'Delete', colorScheme: 'red', isLoading: loading, onClick: onDeleteButtonClick }}
    cancel={{ children: 'Cancel', isDisabled: loading, onClick: onClose }}
    {...{ onClose, ...props }}
  />
)

/** Container Component */
const DeleteAccountDialogContainer: React.VFC<ContainerProps<DeleteAccountDialogProps, PresenterProps>> = ({
  presenter,
  mutation: { deleteAccount },
  ...props
}) => {
  const loading = deleteAccount.loading
  const onDeleteButtonClick = () => deleteAccount.mutate()
  return presenter({ loading, onDeleteButtonClick, ...props })
}

/** DeleteAccountDialog */
export default connect<DeleteAccountDialogProps, PresenterProps>(
  'DeleteAccountDialog',
  DeleteAccountDialogPresenter,
  DeleteAccountDialogContainer
)
