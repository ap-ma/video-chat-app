import { ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
import { useApollo } from 'graphql/apollo'
import type { AppProps } from 'next/app'
import React from 'react'
import { zodCustomErrorMap } from 'utils/lib/zod'
import { z } from 'zod'

// customize zod messages
z.setErrorMap(zodCustomErrorMap)

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
