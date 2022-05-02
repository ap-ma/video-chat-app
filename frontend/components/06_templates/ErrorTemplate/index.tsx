import { Box, Heading, Square, Text } from '@chakra-ui/react'
import Layout, { Title } from 'components/05_layouts/Layout'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'

/** ErrorTemplate Props */
export type ErrorTemplateProps = Record<string, unknown>
/** Presenter Props */
type PresenterProps = ErrorTemplateProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = () => (
  <Layout>
    <Title>error</Title>
    <Square>
      <Box p={5} shadow='md' borderWidth='1px'>
        <Heading fontSize='xl'>Error</Heading>
        <Text mt={3}>A server error has occurred. </Text>
        <Text>Please wait a moment and try again.</Text>
      </Box>
    </Square>
  </Layout>
)

/** Container Component */
const Container: React.VFC<ContainerProps<ErrorTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** ErrorTemplate */
export default connect<ErrorTemplateProps, PresenterProps>('ErrorTemplate', Presenter, Container)
