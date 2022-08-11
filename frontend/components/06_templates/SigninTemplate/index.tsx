import { Flex, Link, Stack, Text, useDisclosure } from '@chakra-ui/react'
import AppLogo from 'components/01_atoms/AppLogo'
import BackgroundWave from 'components/03_molecules/BackgroundWave'
import ForgotPasswordCompleteDialog from 'components/04_organisms/_dialogs/ForgotPasswordCompleteDialog'
import SignupCompleteDialog from 'components/04_organisms/_dialogs/SignupCompleteDialog'
import ForgotPasswordForm from 'components/04_organisms/_forms/ForgotPasswordForm'
import SigninForm from 'components/04_organisms/_forms/SigninForm'
import SignupForm from 'components/04_organisms/_forms/SignupForm'
import HtmlSkeleton, { Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import {
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables,
  SignInMutation,
  SignInMutationVariables,
  SignUpMutation,
  SignUpMutationVariables
} from 'graphql/generated'
import React, { useMemo } from 'react'
import { ContainerProps, Disclosure, MutaionLoading, MutaionReset, MutateFunction, ValidationErrors } from 'types'
import * as styles from './styles'

/** SigninTemplate Props */
export type SigninTemplateProps = {
  /**
   * Mutation
   */
  mutation: {
    /**
     * サインアップ
     */
    signUp: {
      result?: SignUpMutation['signUp']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<SignUpMutation, SignUpMutationVariables>
    }
    /**
     * サインイン
     */
    signIn: {
      result?: SignInMutation['signIn']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<SignInMutation, SignInMutationVariables>
    }
    /**
     * パスワード忘れ
     */
    forgotPassword: {
      result?: ForgotPasswordMutation['forgotPassword']
      loading: MutaionLoading
      errors?: ValidationErrors
      reset: MutaionReset
      mutate: MutateFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>
    }
  }
}

/** Presenter Props */
export type PresenterProps = SigninTemplateProps & {
  disabled: boolean
  // SignUp
  sufDisc: Disclosure
  sucdDisc: Disclosure
  // ForgotPass
  fpfDisc: Disclosure
  fpcdDisc: Disclosure
}

/** Presenter Component */
const SigninTemplatePresenter: React.VFC<PresenterProps> = ({
  mutation: { signIn, forgotPassword, signUp },
  disabled,
  // SignUp
  sufDisc,
  sucdDisc,
  // ForgotPass
  fpfDisc,
  fpcdDisc
}) => (
  <HtmlSkeleton>
    <Title>Sign in</Title>
    <BackgroundWave {...styles.wave}>
      <Flex {...styles.container}>
        <Stack {...styles.contents}>
          <Stack align='center'>
            <AppLogo {...styles.logo} />
            <Text {...styles.linkLabel}>
              New to this app?
              <Link {...styles.link({ disabled })} onClick={sufDisc.onOpen}>
                Create an account.
              </Link>
            </Text>
          </Stack>
          <SigninForm mutation={{ signIn }} onFpfOpen={fpfDisc.onOpen} />
        </Stack>
      </Flex>
    </BackgroundWave>
    <SignupForm mutation={{ signUp }} isOpen={sufDisc.isOpen} onClose={sufDisc.onClose} />
    <SignupCompleteDialog isOpen={sucdDisc.isOpen} onClose={sucdDisc.onClose} />
    <ForgotPasswordForm mutation={{ forgotPassword }} isOpen={fpfDisc.isOpen} onClose={fpfDisc.onClose} />
    <ForgotPasswordCompleteDialog isOpen={fpcdDisc.isOpen} onClose={fpcdDisc.onClose} />
  </HtmlSkeleton>
)

/** Container Component */
const SigninTemplateContainer: React.VFC<ContainerProps<SigninTemplateProps, PresenterProps>> = ({
  presenter,
  mutation: { signUp, signIn, forgotPassword },
  ...props
}) => {
  // Signup modal
  const sufDisc = useDisclosure()
  const sucdDisc = useDisclosure()

  // Signup onComplete
  useMemo(() => {
    if (signUp.result) {
      sufDisc.onClose()
      sucdDisc.onOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signUp.result, sufDisc.onClose, sucdDisc.onOpen])

  // ForgotPassword modal
  const fpfDisc = useDisclosure()
  const fpcdDisc = useDisclosure()

  // ForgotPassword onComplete
  useMemo(() => {
    if (forgotPassword.result) {
      fpfDisc.onClose()
      fpcdDisc.onOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotPassword.result, fpfDisc.onClose, fpcdDisc.onOpen])

  // status
  const disabled = signIn.loading || !!signIn.result

  return presenter({
    mutation: { signUp, signIn, forgotPassword },
    disabled,
    // SignUp
    sufDisc,
    sucdDisc,
    // ForgotPass
    fpfDisc,
    fpcdDisc,
    ...props
  })
}

/** SigninTemplate */
export default connect<SigninTemplateProps, PresenterProps>(
  'SigninTemplate',
  SigninTemplatePresenter,
  SigninTemplateContainer
)
