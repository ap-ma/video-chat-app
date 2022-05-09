import { Heading, Icon, Text } from '@chakra-ui/react'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import ResultIndication, { Body, Head } from 'components/05_layouts/ResultIndication'
import { connect } from 'components/hoc'
import React from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** ErrorTemplate Props */
export type ErrorTemplateProps = Omit<HtmlSkeletonProps, 'children'>
/** Presenter Props */
type PresenterProps = ErrorTemplateProps

/** Presenter Component */
const ErrorTemplatePresenter: React.VFC<PresenterProps> = (props) => (
  <HtmlSkeleton {...props}>
    <Title>Error</Title>
    <ResultIndication>
      <Head>
        <Icon as={RiErrorWarningLine} {...styles.icon} />
        <Heading {...styles.head}>SYSTEM ERROR</Heading>
      </Head>
      <Body>
        <Text {...styles.text}>A system error has occurred.</Text>
        <Text {...styles.text}>Please wait a moment and try again.</Text>
      </Body>
    </ResultIndication>
  </HtmlSkeleton>
)

/** Container Component */
const ErrorTemplateContainer: React.VFC<ContainerProps<ErrorTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** ErrorTemplate */
export default connect<ErrorTemplateProps, PresenterProps>(
  'ErrorTemplate',
  ErrorTemplatePresenter,
  ErrorTemplateContainer
)
