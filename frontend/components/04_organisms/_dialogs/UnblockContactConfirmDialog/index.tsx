import { ButtonProps } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import ConfirmDialog, { ConfirmDialogProps } from 'components/03_molecules/ConfirmDialog'
import { connect } from 'components/hoc'
import { ContactInfoQuery, UnblockContactMutation, UnblockContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction } from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** UnblockContactConfirmDialog Props */
export type UnblockContactConfirmDialogProps = Omit<
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
     * コンタクト削除取消
     */
    unblockContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<UnblockContactMutation, UnblockContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<UnblockContactConfirmDialogProps, 'query' | 'mutation'> & {
  loading: MutaionLoading
  onOkButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const UnblockContactConfirmDialogPresenter: React.VFC<PresenterProps> = ({
  loading,
  onClose,
  onOkButtonClick,
  ...props
}) => (
  <ConfirmDialog
    header='Unblock Contact'
    body='Do you want to unblock this contact?'
    ok={{ ...styles.ok, children: 'OK', isLoading: loading, onClick: onOkButtonClick }}
    cancel={{ w: 'full', children: 'Cancel', isDisabled: loading, onClick: onClose }}
    {...{ onClose, ...props }}
  />
)

/** Container Component */
const UnblockContactConfirmDialogContainer: React.VFC<
  ContainerProps<UnblockContactConfirmDialogProps, PresenterProps>
> = ({ presenter, query: { contactInfo }, mutation: { unblockContact }, ...props }) => {
  const loading = unblockContact.loading
  const onOkButtonClick = () => {
    const contactId = toStr(contactInfo.result?.id)
    unblockContact.reset()
    unblockContact.mutate({ variables: { contactId } }).catch(toast('UnexpectedError'))
  }
  return presenter({ loading, onOkButtonClick, ...props })
}

/** UnblockContactConfirmDialog */
export default connect<UnblockContactConfirmDialogProps, PresenterProps>(
  'UnblockContactConfirmDialog',
  UnblockContactConfirmDialogPresenter,
  UnblockContactConfirmDialogContainer
)
