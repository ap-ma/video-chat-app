import { Flex, FlexProps } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import { ContactInfoQuery, DeleteMessageMutation, DeleteMessageMutationVariables } from 'graphql/generated'
import React from 'react'
import { ContainerProps, MutaionLoading, MutaionReset, MutateFunction } from 'types'
import * as styles from './styles'

/** Message Props */
export type MessageProps = FlexProps & {
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
     * メッセージ削除
     */
    deleteMessage: {
      loading: MutaionLoading
      reset: MutaionReset
      mutate: MutateFunction<DeleteMessageMutation, DeleteMessageMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = MessageProps

/** Presenter Component */
const MessagePresenter: React.VFC<PresenterProps> = ({
  query: { contactInfo },
  mutation: { deleteMessage },
  ...props
}) => <Flex {...styles.root} {...props}></Flex>

/** Container Component */
const MessageContainer: React.VFC<ContainerProps<MessageProps, PresenterProps>> = ({
  presenter,
  query,
  mutation,
  ...props
}) => {
  return presenter({ query, mutation, ...props })
}

/** Message */
export default connect<MessageProps, PresenterProps>('Message', MessagePresenter, MessageContainer)
