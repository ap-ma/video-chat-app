import { ButtonProps } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import ConfirmDialog, { ConfirmDialogProps } from 'components/03_molecules/ConfirmDialog'
import { connect } from 'components/hoc'
import { ContactInfoQuery, UndeleteContactMutation, UndeleteContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction } from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** UndeleteContactConfirmDialog Props */
export type UndeleteContactConfirmDialogProps = Omit<
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
     * コンタクトブロック解除
     */
    undeleteContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<UndeleteContactMutation, UndeleteContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<UndeleteContactConfirmDialogProps, 'query' | 'mutation'> & {
  loading: MutaionLoading
  onOkButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const UndeleteContactConfirmDialogPresenter: React.VFC<PresenterProps> = ({
  loading,
  onClose,
  onOkButtonClick,
  ...props
}) => (
  <ConfirmDialog
    header='Undelete Contact'
    body='Do you want to cancel the deletion of this contact?'
    ok={{ ...styles.ok, children: 'OK', isLoading: loading, onClick: onOkButtonClick }}
    cancel={{ w: 'full', children: 'Cancel', isDisabled: loading, onClick: onClose }}
    {...{ onClose, ...props }}
  />
)

/** Container Component */
const UndeleteContactConfirmDialogContainer: React.VFC<
  ContainerProps<UndeleteContactConfirmDialogProps, PresenterProps>
> = ({ presenter, query: { contactInfo }, mutation: { undeleteContact }, ...props }) => {
  const loading = undeleteContact.loading
  const onOkButtonClick = () => {
    const contactId = toStr(contactInfo.result?.id)
    undeleteContact.reset()
    undeleteContact.mutate({ variables: { contactId } }).catch(toast('UnexpectedError'))
  }
  return presenter({ loading, onOkButtonClick, ...props })
}

/** UndeleteContactConfirmDialog */
export default connect<UndeleteContactConfirmDialogProps, PresenterProps>(
  'UndeleteContactConfirmDialog',
  UndeleteContactConfirmDialogPresenter,
  UndeleteContactConfirmDialogContainer
)
