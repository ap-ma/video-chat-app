import { Button, ButtonProps, Flex, FlexProps, Icon, Stack, Text } from '@chakra-ui/react'
import toast from 'components/01_atoms/Toast'
import { connect } from 'components/hoc'
import { MESSAGE } from 'const'
import { ApproveContactMutation, ApproveContactMutationVariables, ContactInfoQuery, MeQuery } from 'graphql/generated'
import React from 'react'
import { FiUserCheck } from 'react-icons/fi'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction } from 'types'
import { isNullish } from 'utils/general/object'
import * as styles from './styles'

/** ApproveContactBox Props */
export type ApproveContactBoxProps = FlexProps & {
  /**
   * Query
   */
  query: {
    /**
     * ユーザー情報
     */
    me: {
      result?: MeQuery['me']
    }
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
     * コンタクト承認
     */
    approveContact: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<ApproveContactMutation, ApproveContactMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = Omit<ApproveContactBoxProps, 'query' | 'mutation'> & {
  query: Omit<ApproveContactBoxProps['query'], 'me'>
} & {
  loading: MutaionLoading
  onApproveButtonClick: ButtonProps['onClick']
}

/** Presenter Component */
const ApproveContactBoxPresenter: React.VFC<PresenterProps> = ({
  query: { contactInfo },
  loading,
  onApproveButtonClick,
  ...props
}) => (
  <Flex {...styles.root} {...props}>
    <Stack {...styles.segment}>
      <Icon as={FiUserCheck} {...styles.icon} />
      <Stack {...styles.body}>
        <Text>{contactInfo.result?.userName} has applied to contact you.</Text>
        <Button {...styles.button} isLoading={loading} onClick={onApproveButtonClick}>
          Approve
        </Button>
      </Stack>
    </Stack>
  </Flex>
)

/** Container Component */
const ApproveContactBoxContainer: React.VFC<ContainerProps<ApproveContactBoxProps, PresenterProps>> = ({
  presenter,
  query: { me, contactInfo },
  mutation: { approveContact },
  ...props
}) => {
  const loading = approveContact.loading
  const onApproveButtonClick = () => {
    const chat = contactInfo.result?.chat.slice().reverse()
    const applicationMessage = chat?.find((message) => {
      const isApplicationMessage = MESSAGE.CATEGORY.CONTACT_APPLICATION === message.category
      const isReceivedMessage = me.result?.id === message.rxUserId
      return isApplicationMessage && isReceivedMessage
    })

    if (isNullish(applicationMessage)) {
      toast('UnexpectedError')()
      return
    }

    approveContact.reset()
    approveContact.mutate({ variables: { messageId: applicationMessage.id } }).catch(toast('UnexpectedError'))
  }

  return presenter({
    query: { contactInfo },
    loading,
    onApproveButtonClick,
    ...props
  })
}

/** ApproveContactBox */
export default connect<ApproveContactBoxProps, PresenterProps>(
  'ApproveContactBox',
  ApproveContactBoxPresenter,
  ApproveContactBoxContainer
)
