import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { API_URL, API_WS_URL } from 'const'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { AppProps } from 'next/app'
import { useMemo } from 'react'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { isNode, isNullish } from 'utils'
import { cursorPagination, report } from './lib'

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
      Contact: { keyFields: ['id', 'userId'], fields: { chat: cursorPagination() } },
      ChatHistory: { keyFields: ['userId'] },
      MessageChanged: { keyFields: ['txUserId', 'rxUserId'] }
    }
  })
}

/**
 * HttpLinkオブジェクトを生成する
 *
 * @returns HttpLink
 */
function createLink() {
  return new HttpLink({
    uri: API_URL,
    // graphqlサーバー発行のcookieを含める
    credentials: 'include'
  })
}

/**
 * WebSocketLinkオブジェクトを生成する
 *
 * @returns WebSocketLink
 */
function createWsLink() {
  return new WebSocketLink(new SubscriptionClient(API_WS_URL))
}

/**
 * 操作別に通信を分割するための分割関数を適用したLinkを生成する
 *
 * @returns ApolloLink
 */
function splitLink() {
  if (isNode()) return createLink()
  const predicate: Parameters<typeof split>[0] = ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  }
  return split(predicate, createWsLink(), createLink())
}

/**
 * RetryLinkを生成する
 *
 * 通信が不安定な状況において、操作を明示的に失敗するのではなく再試行を試みる
 * delay.jitterをtrueとすることで、Thundering Herdの回避を図る
 *
 * @returns ApolloLink
 */
function createRetryLink() {
  return new RetryLink({
    delay: { initial: 300, max: Infinity, jitter: true },
    attempts: { max: 5, retryIf: (error) => !!error }
  })
}

/**
 * ErrorLinkを生成する
 *
 * サーバーのレスポンスにgraphQLErrorsまたはnetworkErrorが存在するかどうかを確認し、
 * エラーが存在する場合その詳細を受け取り、内容に応じた処理をチェーンに追加する
 *
 * @returns ApolloLink
 */
function createErrorLink() {
  return onError((errorResponse) => report(errorResponse))
}

/**
 * ApolloClientオブジェクトを生成する
 *
 * @returns ApolloClient
 */
function createApolloClient() {
  return new ApolloClient({
    cache: createCache(),
    ssrMode: isNode(),
    link: from([createErrorLink(), createRetryLink(), splitLink()]),
    defaultOptions: {
      // client.query()
      query: { fetchPolicy: 'network-only' },
      // useQuery()
      watchQuery: { fetchPolicy: isNode() ? 'cache-only' : 'cache-and-network' }
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
  if (isNode()) return _apolloClient
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
