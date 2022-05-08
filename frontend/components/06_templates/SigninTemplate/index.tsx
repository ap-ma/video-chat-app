import { Flex, Heading, Link, Stack, Text, useDisclosure } from '@chakra-ui/react'
import BackgroundWave from 'components/03_molecules/BackgroundWave'
import SigninForm, { SigninFormProps } from 'components/04_organisms/forms/SigninForm'
import SignupForm, { SignupFormProps } from 'components/04_organisms/forms/SignupForm'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps, IsOpen, OnClose, OnOpen } from 'types'
import * as styles from './styles'

/** SigninTemplate Props */
export type SigninTemplateProps = Omit<HtmlSkeletonProps, 'children'> & {
  /**
   * Mutation
   */
  mutation: {
    signUp: SignupFormProps['signUp']
    signIn: SigninFormProps['signIn']
    forgotPassword: SigninFormProps['forgotPassword']
  }
}
/** Presenter Props */
type PresenterProps = SigninTemplateProps & {
  isSignUpFormOpen: IsOpen
  onSignUpFormOpen: OnOpen
  onSignUpFormClose: OnClose
}

/** Presenter Component */
const Presenter: React.VFC<PresenterProps> = ({
  mutation: { signIn, forgotPassword, signUp },
  isSignUpFormOpen,
  onSignUpFormOpen,
  onSignUpFormClose,
  ...props
}) => (
  <HtmlSkeleton {...props}>
    <Title>Signin</Title>
    <BackgroundWave {...styles.wave}>
      <Flex {...styles.container} {...props}>
        <Stack {...styles.contents}>
          <Stack align='center'>
            <Heading {...styles.head}>Sign in to your account</Heading>
            <Text {...styles.linkLabel}>
              New to this app?
              <Link {...styles.link} onClick={onSignUpFormOpen}>
                Create an account.
              </Link>
            </Text>
          </Stack>
          <SigninForm {...{ signIn, forgotPassword }} />
        </Stack>
      </Flex>
    </BackgroundWave>
    <SignupForm signUp={signUp} isOpen={isSignUpFormOpen} onClose={onSignUpFormClose} />
  </HtmlSkeleton>
)

/** Container Component */
const Container: React.VFC<ContainerProps<SigninTemplateProps, PresenterProps>> = ({ presenter, ...props }) => {
  const { isOpen: isSignUpFormOpen, onOpen: onSignUpFormOpen, onClose: onSignUpFormClose } = useDisclosure()
  return presenter({ isSignUpFormOpen, onSignUpFormOpen, onSignUpFormClose, ...props })
}

/** SigninTemplate */
export default connect<SigninTemplateProps, PresenterProps>('SigninTemplate', Presenter, Container)
