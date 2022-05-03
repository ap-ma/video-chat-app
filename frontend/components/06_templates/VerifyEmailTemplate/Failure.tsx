import { Heading, Icon, Text } from '@chakra-ui/react'
import ResultIndication, { Body, Head } from 'components/05_layouts/ResultIndication'
import { connect } from 'components/hoc'
import React from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Failure Props */
export type FailureProps = Record<string, unknown>
type PresenterProps = FailureProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = () => (
  <ResultIndication>
    <Head>
      <Icon as={RiErrorWarningLine} {...styles.failureIcon} />
      <Heading {...styles.head}>Verification Failure</Heading>
    </Head>
    <Body>
      <Text {...styles.text}>URL is incorrect or link has expired.</Text>
      <Text {...styles.text}>Please try the operation again.</Text>
    </Body>
  </ResultIndication>
)

/** Container Component */
const Container: React.VFC<ContainerProps<FailureProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** Failure */
export default connect<FailureProps, PresenterProps>('Failure', Presenter, Container)
