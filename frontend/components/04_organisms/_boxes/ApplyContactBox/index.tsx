import { Button, ButtonProps, Flex, FlexProps, Icon, Stack, Text } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import { connect } from 'components/hoc'
import {
  ApplyContactMutation,
  ApplyContactMutationVariables,
  ContactInfoQuery,
  ContactInfoQueryVariables
} from 'graphql/generated'
import React from 'react'
import { FiUserPlus } from 'react-icons/fi'
import {
  ContainerProps,
  MutaionLoading,
  MutaionReset,
  MutateFunction,
  QueryFetchMore,
  QueryLoading,
  QueryNetworkStatus
} from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** ApplyContactBox Props */
export type ApplyContactBoxProps = FlexProps & {
  /**
   * Query
   */
  query: {
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
export type PresenterProps = Omit<ApplyContactBoxProps, 'mutation'> & {
  loading: MutaionLoading
  onApplyButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const ApplyContactBoxPresenter: React.VFC<PresenterProps> = ({
  query: { contactInfo },
  loading,
  onApplyButtonClick,
  ...props
}) => (
  <Flex {...styles.root} {...props}>
    <Stack {...styles.segment}>
      <Icon as={FiUserPlus} {...styles.icon} />
      <Stack {...styles.body}>
        <Text>{contactInfo.result?.userName} has not been added to your contacts.</Text>
        <Button {...styles.button} isLoading={loading} onClick={onApplyButtonClick}>
          Apply
        </Button>
      </Stack>
    </Stack>
  </Flex>
)

/** Container Component */
const ApplyContactBoxContainer: React.VFC<ContainerProps<ApplyContactBoxProps, PresenterProps>> = ({
  presenter,
  query: { contactInfo },
  mutation: { applyContact },
  ...props
}) => {
  const loading = applyContact.loading
  const onApplyButtonClick = () => {
    const otherUserId = toStr(contactInfo.result?.userId)
    applyContact.reset()
    applyContact.mutate({ variables: { otherUserId } }).catch(toast('UnexpectedError'))
  }
  return presenter({ query: { contactInfo }, loading, onApplyButtonClick, ...props })
}

/** ApplyContactBox */
export default connect<ApplyContactBoxProps, PresenterProps>(
  'ApplyContactBox',
  ApplyContactBoxPresenter,
  ApplyContactBoxContainer
)
