import { Flex, Heading, Link, Stack, Text, useDisclosure } from '@chakra-ui/react'
import BackgroundWave from 'components/03_molecules/BackgroundWave'
import ForgotPasswordCompleteDialog from 'components/04_organisms/dialogs/ForgotPasswordCompleteDialog'
import SignupCompleteDialog from 'components/04_organisms/dialogs/SignupCompleteDialog'
import ForgotPasswordForm, { ForgotPasswordFormProps } from 'components/04_organisms/forms/ForgotPasswordForm'
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
  mutation: SignupFormProps['mutation'] & SigninFormProps['mutation'] & ForgotPasswordFormProps['mutation']
}

/** Presenter Props */
type PresenterProps = SigninTemplateProps & {
  // sign up
  isSufOpen: IsOpen
  onSufOpen: OnOpen
  onSufClose: OnClose
  isSucdOpen: IsOpen
  onSucdClose: OnClose
  // forgot pass
  isFpfOpen: IsOpen
  onFpfOpen: OnOpen
  onFpfClose: OnClose
  isFpcdOpen: IsOpen
  onFpcdClose: OnClose
}

/** Presenter Component */
const SigninTemplatePresenter: React.VFC<PresenterProps> = ({
  mutation: { signIn, forgotPassword, signUp },
  // sign up
  isSufOpen,
  onSufOpen,
  onSufClose,
  isSucdOpen,
  onSucdClose,
  // forgot pass
  isFpfOpen,
  onFpfOpen,
  onFpfClose,
  isFpcdOpen,
  onFpcdClose,
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
              <Link {...styles.link(signIn.loading)} onClick={onSufOpen}>
                Create an account.
              </Link>
            </Text>
          </Stack>
          <SigninForm mutation={{ signIn }} onFpfOpen={onFpfOpen} />
        </Stack>
      </Flex>
    </BackgroundWave>
    <SignupForm mutation={{ signUp }} isOpen={isSufOpen} onClose={onSufClose} />
    <SignupCompleteDialog isOpen={isSucdOpen} onClose={onSucdClose} />
    <ForgotPasswordForm mutation={{ forgotPassword }} isOpen={isFpfOpen} onClose={onFpfClose} />
    <ForgotPasswordCompleteDialog isOpen={isFpcdOpen} onClose={onFpcdClose} />
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
      mutation.signUp.reset()
    }
  }, [onSufClose, onSucdOpen, mutation.signUp])

  // ForgotPasswordForm
  const { isOpen: isFpfOpen, onOpen: onFpfOpen, onClose: onFpfClose } = useDisclosure()
  // ForgotPassworCompleteDialog
  const { isOpen: isFpcdOpen, onOpen: onFpcdOpen, onClose: onFpcdClose } = useDisclosure()
  // forgot password 完了時
  useMemo(() => {
    if (mutation.forgotPassword.result) {
      onFpfClose()
      onFpcdOpen()
      mutation.forgotPassword.reset()
    }
  }, [onFpfClose, onFpcdOpen, mutation.forgotPassword])

  return presenter({
    mutation,
    // sign up
    isSufOpen,
    onSufOpen,
    onSufClose,
    isSucdOpen,
    onSucdClose,
    // forgot pass
    isFpfOpen,
    onFpfOpen,
    onFpfClose,
    isFpcdOpen,
    onFpcdClose,
    ...props
  })
}

/** SigninTemplate */
export default connect<SigninTemplateProps, PresenterProps>(
  'SigninTemplate',
  SigninTemplatePresenter,
  SigninTemplateContainer
)
