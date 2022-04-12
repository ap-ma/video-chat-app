import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { concatPagination } from '@apollo/client/utilities'
import { API_URL } from 'const'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { AppProps } from 'next/app'
import { useMemo } from 'react'
import { isNullish } from 'utils'

/** props apollo state key */
export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

/** ApolloClient */
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

/**
 * InMemoryCacheオブジェクトを生成する
 *
 * @returns InMemoryCache
 */
function createCache() {
  return new InMemoryCache({
    typePolicies: {
      Query: { fields: { allPosts: concatPagination() } }
    }
  })
}

/**
 * ApolloClientオブジェクトを生成する
 *
 * @returns ApolloClient
 */
function createApolloClient() {
  return new ApolloClient({
    cache: createCache(),
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: API_URL,
      credentials: 'include'
    }),
    defaultOptions: {
      // useQuery
      watchQuery: { fetchPolicy: 'cache-and-network' },
      // client.query()
      query: { fetchPolicy: 'network-only' }
    }
  })
}

/**
 * ApolloClientオブジェクトを返す
 *
 * SSR/SSG時は常に新たなApolloClientを作成する
 * CSR時は既にApolloClientが作成済みの場合はそちらを返し、
 * 未作成時は新たなApolloClientを作成する
 *
 * 引数にて初期状態が指定された場合、
 * キャッシュに初期状態をマージした上でApolloClientを返す
 *
 * @param initialState - キャッシュの初期状態
 * @returns initialStateがマージされたApolloClient
 */
export function initializeApollo(
  initialState?: NormalizedCacheObject
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient()

  // 初期状態が与えられた場合、ApolloClientに初期状態をマージする
  if (!isNullish(initialState)) {
    // CSRにおけるApolloClientの既存キャッシュ
    const existingCache = _apolloClient.extract()

    // 初期状態を既存キャッシュにマージ
    const data = merge(existingCache, initialState, {
      // 等価性をもとに配列を結合
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s)))
      ]
    })

    // マージ済みデータでキャッシュをリストア
    _apolloClient.cache.restore(data)
  }
  // SSR/SSG時は常に新規で作成されたApolloClientを返す
  if (typeof window === 'undefined') return _apolloClient
  // CSR時でApolloClientを新規作成した場合は、変数に保持
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

/**
 * ApolloClientのキャッシュをページのpropsに追加する
 *
 * @param client - propsに追加する対象となるデータを持つApolloClient
 * @param pageProps - ページのprops
 * @returns ApolloClientのキャッシュが追加されたprops
 */
export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps?: AppProps['pageProps']
): AppProps['pageProps'] {
  if (isNullish(pageProps)) pageProps = { props: {} }
  if (isNullish(pageProps.props)) pageProps.props = {}
  pageProps.props[APOLLO_STATE_PROP_NAME] = client.extract()
  return pageProps
}

/**
 * propsに保持した初期状態を持つApolloClientを取得する
 *
 * @param pageProps - ApolloClientの初期状態を持つページのprops
 * @returns props保持の初期状態を持つApolloClient
 */
export function useApollo(pageProps: AppProps['pageProps']): ApolloClient<NormalizedCacheObject> {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const client = useMemo(() => initializeApollo(state), [state])
  return client
}
