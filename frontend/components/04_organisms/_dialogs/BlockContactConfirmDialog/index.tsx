import { ButtonProps } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import ConfirmDialog, { ConfirmDialogProps } from 'components/03_molecules/ConfirmDialog'
import { connect } from 'components/hoc'
import { BlockContactMutation, BlockContactMutationVariables, ContactInfoQuery } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction } from 'types'
import { toStr } from 'utils/general/helper'

/** BlockContactConfirmDialog Props */
export type BlockContactConfirmDialogProps = Omit<
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
     * コンタクトブロック
     */
    blockContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<BlockContactMutation, BlockContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<BlockContactConfirmDialogProps, 'query' | 'mutation'> & {
  loading: MutaionLoading
  onOkButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const BlockContactConfirmDialogPresenter: React.VFC<PresenterProps> = ({
  loading,
  onClose,
  onOkButtonClick,
  ...props
}) => (
  <ConfirmDialog
    header='Block Contact'
    body='Do you want to block this contact?'
    ok={{ w: 'full', colorScheme: 'red', children: 'OK', isLoading: loading, onClick: onOkButtonClick }}
    cancel={{ w: 'full', children: 'Cancel', isDisabled: loading, onClick: onClose }}
    {...{ onClose, ...props }}
  />
)

/** Container Component */
const BlockContactConfirmDialogContainer: React.VFC<ContainerProps<BlockContactConfirmDialogProps, PresenterProps>> = ({
  presenter,
  query: { contactInfo },
  mutation: { blockContact },
  ...props
}) => {
  const loading = blockContact.loading
  const onOkButtonClick = () => {
    const contactId = toStr(contactInfo.result?.id)
    blockContact.reset()
    blockContact.mutate({ variables: { contactId } }).catch(toast('UnexpectedError'))
  }
  return presenter({ loading, onOkButtonClick, ...props })
}

/** BlockContactConfirmDialog */
export default connect<BlockContactConfirmDialogProps, PresenterProps>(
  'BlockContactConfirmDialog',
  BlockContactConfirmDialogPresenter,
  BlockContactConfirmDialogContainer
)
