import { useDisclosure } from '@chakra-ui/react'
import EmailVerificationFailureDialog from 'components/04_organisms/dialogs/EmailVerificationFailureDialog'
import EmailVerificationSuccessDialog from 'components/04_organisms/dialogs/EmailVerificationSuccessDialog'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import { VerifyEmailMutation } from 'graphql/generated'
import React from 'react'
import { ContainerProps, IsOpen, OnClose } from 'types'

/** VerifyEmailTemplate Props */
export type VerifyEmailTemplateProps = Omit<HtmlSkeletonProps, 'children'> &
  Partial<{
    /**
     * メール検証結果
     */
    result: VerifyEmailMutation['verifyEmail']
  }>

/** Presenter Props */
export type PresenterProps = Omit<VerifyEmailTemplateProps, 'result'> & {
  isEvsdOpen: IsOpen
  onEvsdClose: OnClose
  isEvfdOpen: IsOpen
  onEvfdClose: OnClose
}

/** Presenter Component */
const VerifyEmailTemplatePresenter: React.VFC<PresenterProps> = ({
  isEvsdOpen,
  onEvsdClose,
  isEvfdOpen,
  onEvfdClose,
  ...props
}) => (
  <HtmlSkeleton {...props}>
    <Title>Verify Email</Title>
    <EmailVerificationSuccessDialog isOpen={isEvsdOpen} onClose={onEvsdClose} />
    <EmailVerificationFailureDialog isOpen={isEvfdOpen} onClose={onEvfdClose} />
  </HtmlSkeleton>
)

/** Container Component */
const VerifyEmailTemplateContainer: React.VFC<ContainerProps<VerifyEmailTemplateProps, PresenterProps>> = ({
  presenter,
  result,
  ...props
}) => {
  const { isOpen: isEvsdOpen, onClose: onEvsdClose } = useDisclosure({ isOpen: result })
  const { isOpen: isEvfdOpen, onClose: onEvfdClose } = useDisclosure({ isOpen: !result })

  return presenter({
    isEvsdOpen,
    onEvsdClose,
    isEvfdOpen,
    onEvfdClose,
    ...props
  })
}

/** VerifyEmailTemplate */
export default connect<VerifyEmailTemplateProps, PresenterProps>(
  'VerifyEmailTemplate',
  VerifyEmailTemplatePresenter,
  VerifyEmailTemplateContainer
)
