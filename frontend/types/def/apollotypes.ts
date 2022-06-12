import { MutationResult, MutationTuple, QueryResult, QueryTuple, Reference, StoreObject } from '@apollo/client'
import { GraphQLError } from 'graphql'

//  ----------------------------------------------------------------------------
//  GraphQL Error types
//  ----------------------------------------------------------------------------

/** API エラー型定義 */
export declare class APIError extends GraphQLError {
  extensions: { type: string }
}

/** API サーバーエラー型定義 */
export declare class ServerError extends APIError {
  extensions: { type: string; description: string }
}

/** API 認証エラー型定義 */
export declare class AuthenticationError extends APIError {}

/** API 認可エラー型定義 */
export declare class AuthorizationError extends APIError {}

/** API 検証エラー型定義 */
export declare class ValidationError extends APIError {
  extensions: { type: string; field: string }
}

/** API サーバーエラー配列型定義 */
export type ServerErrors = ReadonlyArray<ServerError>

/** API 認証エラー配列型定義 */
export type AuthenticationErrors = ReadonlyArray<AuthenticationError>

/** API 認可エラー配列型定義 */
export type AuthorizationErrors = ReadonlyArray<AuthorizationError>

/** API 検証エラー配列型定義 */
export type ValidationErrors = ReadonlyArray<ValidationError>

//  ----------------------------------------------------------------------------
//  Apollo Client common types
//  ----------------------------------------------------------------------------

/** Apollo Client readField Param Type */
export type ReadFieldParam = StoreObject | Reference | undefined

/** Apollo Client Query loading */
export type QueryLoading = QueryResult['loading']

/** Apollo Client Query networkStatus */
export type QueryNetworkStatus = QueryResult['networkStatus']

/** Apollo Client Query refetch */
export type QueryRefetch<TData, TVariables> = QueryResult<TData, TVariables>['refetch']

/** Apollo Client Query fetchMore */
export type QueryFetchMore<TData, TVariables> = QueryResult<TData, TVariables>['fetchMore']

/** Apollo Client LazyQuery query function */
export type LazyQueryFunction<TData, TVariables> = QueryTuple<TData, TVariables>[0]

/** Apollo Client Mutation loading */
export type MutaionLoading = MutationResult['loading']

/** Apollo Client Mutation reset */
export type MutaionReset = MutationResult['reset']

/** Apollo Client Mutation mutate function */
export type MutateFunction<TData, TVariables> = MutationTuple<TData, TVariables>[0]
