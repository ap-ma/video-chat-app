import { useDisclosure } from '@chakra-ui/react'
import EmailVerificationFailureDialog from 'components/04_organisms/dialogs/EmailVerificationFailureDialog'
import EmailVerificationSuccessDialog from 'components/04_organisms/dialogs/EmailVerificationSuccessDialog'
import HtmlSkeleton, { HtmlSkeletonProps, Title } from 'components/05_layouts/HtmlSkeleton'
import { connect } from 'components/hoc'
import { VerifyEmailMutation } from 'graphql/generated'
import React from 'react'
import { ContainerProps, Disclosure } from 'types'

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
  evsdDisc: Disclosure
  evfdDisc: Disclosure
}

/** Presenter Component */
const VerifyEmailTemplatePresenter: React.VFC<PresenterProps> = ({ evsdDisc, evfdDisc, ...props }) => (
  <HtmlSkeleton {...props}>
    <Title>Verify Email</Title>
    <EmailVerificationSuccessDialog isOpen={evsdDisc.isOpen} onClose={evsdDisc.onClose} />
    <EmailVerificationFailureDialog isOpen={evfdDisc.isOpen} onClose={evfdDisc.onClose} />
  </HtmlSkeleton>
)

/** Container Component */
const VerifyEmailTemplateContainer: React.VFC<ContainerProps<VerifyEmailTemplateProps, PresenterProps>> = ({
  presenter,
  result,
  ...props
}) => {
  // EmailVerification dialog
  const evsdDisc = useDisclosure({ isOpen: result })
  const evfdDisc = useDisclosure({ isOpen: !result })

  return presenter({
    evsdDisc,
    evfdDisc,
    ...props
  })
}

/** VerifyEmailTemplate */
export default connect<VerifyEmailTemplateProps, PresenterProps>(
  'VerifyEmailTemplate',
  VerifyEmailTemplatePresenter,
  VerifyEmailTemplateContainer
)
