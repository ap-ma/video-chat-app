import { Flex, Heading, Link, Stack, Text, useDisclosure } from '@chakra-ui/react'
import BackgroundWave from 'components/03_molecules/BackgroundWave'
import SignupCompleteDialog from 'components/04_organisms/dialogs/SignupCompleteDialog'
import SigninForm, { SigninFormProps } from 'components/04_organisms/forms/SigninForm'
import SignupForm, { SignupFormProps } from 'components/04_organisms/forms/SignupForm'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import React, { useMemo } from 'react'
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
  isSufOpen: IsOpen
  onSufOpen: OnOpen
  onSufClose: OnClose
  isSucdOpen: IsOpen
  onSucdClose: OnClose
}

/** Presenter Component */
const SigninTemplatePresenter: React.VFC<PresenterProps> = ({
  mutation: { signIn, forgotPassword, signUp },
  isSufOpen,
  onSufOpen,
  onSufClose,
  isSucdOpen,
  onSucdClose,
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
              <Link {...styles.link} onClick={onSufOpen}>
                Create an account.
              </Link>
            </Text>
          </Stack>
          <SigninForm {...{ signIn, forgotPassword }} />
        </Stack>
      </Flex>
    </BackgroundWave>
    <SignupForm signUp={signUp} isOpen={isSufOpen} onClose={onSufClose} />
    <SignupCompleteDialog isOpen={isSucdOpen} onClose={onSucdClose} />
  </HtmlSkeleton>
)

/** Container Component */
const SigninTemplateContainer: React.VFC<ContainerProps<SigninTemplateProps, PresenterProps>> = ({
  presenter,
  mutation,
  ...props
}) => {
  // SignupForm
  const { isOpen: isSufOpen, onOpen: onSufOpen, onClose: onSufClose } = useDisclosure()
  // SignupCompleteDialog
  const { isOpen: isSucdOpen, onOpen: onSucdOpen, onClose: onSucdClose } = useDisclosure()
  // sign up 完了時
  useMemo(() => {
    if (mutation.signUp.result) {
      onSufClose()
      onSucdOpen()
    }
  }, [onSufClose, onSucdOpen, mutation.signUp])

  return presenter({
    mutation,
    isSufOpen,
    onSufOpen,
    onSufClose,
    isSucdOpen,
    onSucdClose,
    ...props
  })
}

/** SigninTemplate */
export default connect<SigninTemplateProps, PresenterProps>(
  'SigninTemplate',
  SigninTemplatePresenter,
  SigninTemplateContainer
)
