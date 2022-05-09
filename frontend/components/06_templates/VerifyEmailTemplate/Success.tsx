import { Box as Spacer, Heading, Icon, Text } from '@chakra-ui/react'
import Link from 'components/01_atoms/Link'
import ResultIndication, { Body, Head } from 'components/05_layouts/ResultIndication'
import { connect } from 'components/hoc'
import { INDEX_PAGE } from 'const'
import React from 'react'
import { RiCheckboxCircleLine } from 'react-icons/ri'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Success Props */
export type SuccessProps = Record<string, unknown>
type PresenterProps = SuccessProps

/** Presenter Component */
const SuccessPresenter: React.VFC<PresenterProps> = () => (
  <ResultIndication>
    <Head>
      <Icon as={RiCheckboxCircleLine} {...styles.successIcon} />
      <Heading {...styles.head}>Email Verified</Heading>
    </Head>
    <Body>
      <Text {...styles.text}>Email verification has been completed.</Text>
      <Text {...styles.text}>Click the link below to go to the home page.</Text>
      <Spacer p='1.5' />
      <Link href={INDEX_PAGE} color='blue.400'>
        Go to Home
      </Link>
    </Body>
  </ResultIndication>
)

/** Container Component */
const SuccessContainer: React.VFC<ContainerProps<SuccessProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Success */
export default connect<SuccessProps, PresenterProps>('Success', SuccessPresenter, SuccessContainer)
