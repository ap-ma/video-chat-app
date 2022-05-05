import { Heading, Stack, Text } from '@chakra-ui/react'
import Link from 'components/01_atoms/Link'
import BackgroundWave from 'components/03_molecules/BackgroundWave'
import SigninForm, { SigninFormProps } from 'components/04_organisms/forms/SigninForm'
import AuthForm from 'components/05_layouts/AuthForm'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** SigninTemplate Props */
export type SigninTemplateProps = Omit<HtmlSkeletonProps, 'children'> & SigninFormProps
/** Presenter Props */
type PresenterProps = SigninTemplateProps

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({ signIn, signUp, forgotPassword, ...props }) => (
  <HtmlSkeleton {...props}>
    <Title>Signin</Title>
    <BackgroundWave {...styles.wave}>
      <AuthForm bg='inherit'>
        <Stack align='center'>
          <Heading {...styles.head}>Sign in to your account</Heading>
          <Text {...styles.linkLabel}>
            New to this app?
            <Link ml={3} href='#'>
              Create an account.
            </Link>
          </Text>
        </Stack>
        <SigninForm {...{ signIn, signUp, forgotPassword }} />
      </AuthForm>
    </BackgroundWave>
  </HtmlSkeleton>
)

/** Container Component */
const Container: React.VFC<ContainerProps<SigninTemplateProps, PresenterProps>> = ({
  presenter,
  ...props
}) => {
  return presenter({ ...props })
}

/** SigninTemplate */
export default connect<SigninTemplateProps, PresenterProps>('SigninTemplate', Presenter, Container)
