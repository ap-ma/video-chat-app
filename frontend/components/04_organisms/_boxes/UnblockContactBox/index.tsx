import { Box, Button, ButtonProps, Flex, FlexProps, Icon, Stack, Text } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import { connect } from 'components/hoc'
import { ContactInfoQuery, UnblockContactMutation, UnblockContactMutationVariables } from 'graphql/generated'
import React from 'react'
import { FiLock } from 'react-icons/fi'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction } from 'types'
import { toStr } from 'utils/general/helper'
import * as styles from './styles'

/** UnblockContactBox Props */
export type UnblockContactBoxProps = FlexProps & {
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
     * ブロック解除
     */
    unblockContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<UnblockContactMutation, UnblockContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<UnblockContactBoxProps, 'mutation'> & {
  loading: MutaionLoading
  onUnblockButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const UnblockContactBoxPresenter: React.VFC<PresenterProps> = ({
  query: { contactInfo },
  loading,
  onUnblockButtonClick,
  ...props
}) => (
  <Flex {...styles.root} {...props}>
    <Stack {...styles.segment}>
      <Icon as={FiLock} {...styles.icon} />
      <Stack {...styles.body}>
        <Box>
          <Text>You are blocking {contactInfo.result?.userName}.</Text>
          <Text>Click below to unblock</Text>
        </Box>
        <Button {...styles.button} isLoading={loading} onClick={onUnblockButtonClick}>
          Unblock
        </Button>
      </Stack>
    </Stack>
  </Flex>
)

/** Container Component */
const UnblockContactBoxContainer: React.VFC<ContainerProps<UnblockContactBoxProps, PresenterProps>> = ({
  presenter,
  query: { contactInfo },
  mutation: { unblockContact },
  ...props
}) => {
  const loading = unblockContact.loading
  const onUnblockButtonClick = () => {
    const contactId = toStr(contactInfo.result?.id)
    unblockContact.reset()
    unblockContact.mutate({ variables: { contactId } }).catch(toast('UnexpectedError'))
  }
  return presenter({ query: { contactInfo }, loading, onUnblockButtonClick, ...props })
}

/** UnblockContactBox */
export default connect<UnblockContactBoxProps, PresenterProps>(
  'UnblockContactBox',
  UnblockContactBoxPresenter,
  UnblockContactBoxContainer
)
