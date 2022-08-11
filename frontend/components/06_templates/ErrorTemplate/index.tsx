import { Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import React from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** ErrorTemplate Props */
export type ErrorTemplateProps = Omit<HtmlSkeletonProps, 'children'>
/** Presenter Props */
export type PresenterProps = ErrorTemplateProps

/** Presenter Component */
const ErrorTemplatePresenter: React.VFC<PresenterProps> = () => (
  <HtmlSkeleton>
    <Title>Error</Title>
    <Flex {...styles.container}>
      <Stack {...styles.segment}>
        <Stack align='center'>
          <Icon as={RiErrorWarningLine} {...styles.icon} />
          <Heading {...styles.head}>SYSTEM ERROR</Heading>
        </Stack>
        <Stack align='center' spacing={1}>
          <Text {...styles.text}>A system error has occurred.</Text>
          <Text {...styles.text}>Please wait a moment and try again.</Text>
        </Stack>
      </Stack>
    </Flex>
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
