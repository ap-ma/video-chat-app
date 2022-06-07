import { ButtonProps } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import ConfirmDialog, { ConfirmDialogProps } from 'components/03_molecules/ConfirmDialog'
import { connect } from 'components/hoc'
import { ApplyContactMutation, ApplyContactMutationVariables, ContactInfoQuery } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction } from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** ApplyContactConfirmDialog Props */
export type ApplyContactConfirmDialogProps = Omit<
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
     * コンタクト申請
     */
    applyContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<ApplyContactMutation, ApplyContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ApplyContactConfirmDialogProps, 'query' | 'mutation'> & {
  loading: MutaionLoading
  onOkButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const ApplyContactConfirmDialogPresenter: React.VFC<PresenterProps> = ({
  loading,
  onClose,
  onOkButtonClick,
  ...props
}) => (
  <ConfirmDialog
    header='Apply Contact'
    body='Do you want to apply for a contact?'
    ok={{ ...styles.ok, children: 'OK', isLoading: loading, onClick: onOkButtonClick }}
    cancel={{ w: 'full', children: 'Cancel', isDisabled: loading, onClick: onClose }}
    {...{ onClose, ...props }}
  />
)

/** Container Component */
const ApplyContactConfirmDialogContainer: React.VFC<ContainerProps<ApplyContactConfirmDialogProps, PresenterProps>> = ({
  presenter,
  query: { contactInfo },
  mutation: { applyContact },
  ...props
}) => {
  const loading = applyContact.loading
  const onOkButtonClick = () => {
    const otherUserId = toStr(contactInfo.result?.userId)
    applyContact.reset()
    applyContact.mutate({ variables: { otherUserId } }).catch(toast('UnexpectedError'))
  }
  return presenter({ loading, onOkButtonClick, ...props })
}

/** ApplyContactConfirmDialog */
export default connect<ApplyContactConfirmDialogProps, PresenterProps>(
  'ApplyContactConfirmDialog',
  ApplyContactConfirmDialogPresenter,
  ApplyContactConfirmDialogContainer
)
