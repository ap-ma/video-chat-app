import { ApolloProvider } from '@apollo/client'
import { useApollo } from 'graphql/apollo'
import type { AppProps } from 'next/app'
import React from 'react'

const App: React.VFC<AppProps> = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps)
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default App
