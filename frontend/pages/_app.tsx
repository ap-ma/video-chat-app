import { ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
import { useApollo } from 'graphql/apollo'
import type { AppProps } from 'next/app'
import React from 'react'

const App: React.VFC<AppProps> = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps)
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default App
