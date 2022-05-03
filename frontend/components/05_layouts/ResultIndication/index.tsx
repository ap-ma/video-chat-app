import { Flex, FlexProps, Stack } from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React, { Children } from 'react'
import { ContainerProps, WithChildren } from 'types'
import { isReactElement } from 'utils/impl/object'
import Body, { BodyProps } from './Body'
import Head, { HeadProps } from './Head'
import * as styles from './styles'

/** ResultIndication Props */
export type ResultIndicationProps = FlexProps & WithChildren
/** Presenter Props */
type PresenterProps = Omit<ResultIndicationProps, 'children'> & {
  head: HeadProps['children']
  body: BodyProps['children']
}

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ head, body, ...props }) => (
  <Flex {...styles.root} {...props}>
    <Stack {...styles.segment}>
      <Stack align='center'>{head}</Stack>
      <Stack align='center' spacing={1}>
        {body}
      </Stack>
    </Stack>
  </Flex>
)

/** Container Component */
const Container: React.VFC<ContainerProps<ResultIndicationProps, PresenterProps>> = ({
  presenter,
  children,
  ...props
}) => {
  let head: PresenterProps['head']
  let body: PresenterProps['body']
  Children.forEach(children, (child) => {
    if (isReactElement(child) && child.type === Head) head = child.props.children
    if (isReactElement(child) && child.type === Body) body = child.props.children
  })

  return presenter({ head, body, ...props })
}

/** ResultIndication */
export default connect<ResultIndicationProps, PresenterProps>(
  'ResultIndication',
  Presenter,
  Container
)

// Sub Component
export { Body, Head }
export type { BodyProps, HeadProps }
