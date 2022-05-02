import { ApolloError } from '@apollo/client/errors'
import VerifyEmailTemplate, {
  VerifyEmailTemplateProps
} from 'components/06_templates/VerifyEmailTemplate'
import { ERROR_PAGE } from 'const'
import { addApolloState, initializeApollo } from 'graphql/apollo'
import {
  VerifyEmailDocument,
  VerifyEmailMutation,
  VerifyEmailMutationVariables
} from 'graphql/generated'
import { handle } from 'graphql/lib'
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'
import { Unbox } from 'types'

const VerifyEmail: NextPage<VerifyEmailTemplateProps> = (props) => {
  return <VerifyEmailTemplate {...props} />
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const apolloClient = initializeApollo()

  let error: ApolloError | undefined = undefined
  const { data } = await apolloClient
    .mutate<VerifyEmailMutation, VerifyEmailMutationVariables>({
      mutation: VerifyEmailDocument,
      variables: {
        token: params?.token as Exclude<Unbox<GetServerSidePropsContext['params']>, string[]>
      }
    })
    .catch((e) => {
      error = e as ApolloError
      return { data: undefined }
    })

  return handle(error, {
    noError: () => addApolloState(apolloClient, { props: { result: data?.verifyEmail } }),
    validationError: (errors) => addApolloState(apolloClient, { props: { errors } }),
    _default: () => ({ redirect: { permanent: false, destination: ERROR_PAGE } })
  })
}

export default VerifyEmail
