import { Box, BoxProps, Button, Heading, Icon, Stack, Text } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import { ContactInfoQuery, ContactInfoQueryVariables } from 'graphql/generated'
import React from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { ContainerProps, OnOpen, QueryFetchMore, QueryLoading, QueryNetworkStatus } from 'types'
import * as styles from './styles'

/** WorkflowCard Props */
export type WorkflowCardProps = BoxProps & {
  /**
   * コンタクト申請ダイアログ onOpen
   */
  onApplyccdOpen: OnOpen
  /**
   * コンタクト承認ダイアログ onOpen
   */
  onApproveccdOpen: OnOpen
  /**
   * コンタクトブロック解除ダイアログ onOpen
   */
  onUbccdOpen: OnOpen
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
}

/** Presenter Props */
export type PresenterProps = WorkflowCardProps

/** Presenter Component */
const WorkflowCardPresenter: React.VFC<PresenterProps> = ({ query: { contactInfo }, ...props }) => (
  <Box {...styles.root} {...props}>
    <Stack {...styles.segment}>
      <Stack align='center'>
        <Icon as={BsCheckLg} w={16} h={16} color='green.500' />
        <Heading textTransform='uppercase' fontSize='3xl' color='gray.800'>
          success
        </Heading>
      </Stack>
      <Stack align='center' spacing={1}>
        <Text>{contactInfo.result?.userName} has not been added to your contacts.</Text>
        <Text>Would you like to apply for contact?</Text>
        <Button>OK</Button>
      </Stack>
    </Stack>
  </Box>
)

/** Container Component */
const WorkflowCardContainer: React.VFC<ContainerProps<WorkflowCardProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** WorkflowCard */
export default connect<WorkflowCardProps, PresenterProps>('WorkflowCard', WorkflowCardPresenter, WorkflowCardContainer)
