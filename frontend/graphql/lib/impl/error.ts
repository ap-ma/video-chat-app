import { GraphQLErrors, NetworkError } from '@apollo/client/errors'
import { ErrorResponse } from '@apollo/client/link/error'
import { isNonEmptyArray as isNotBlank, isNullish } from 'utils'

/** GraphQL Error Type */
export const GqlErrorType = {
  InternalServerError: 'InternalServerError',
  AuthenticationError: 'AuthenticationError',
  AuthorizationError: 'AuthorizationError',
  ValidationError: 'ValidationError'
} as const

/**
 * ApolloErrorのエラー種別に応じた指定関数の実行結果を返す
 * 対象エラー種別の関数が未定義の場合、_defaultの実行結果を返す
 *
 * @param error - ApolloError
 * @param supplier - エラー種別に応じて実行される関数をプロパティに持つオブジェクト
 * @returns エラー種別に応じた関数の実行結果
 */
export const handle = <R>(
  error: Partial<{ networkError: NetworkError; graphQLErrors: GraphQLErrors }> | undefined,
  supplier: Partial<{
    noError: () => R
    internalServerError: (errors: GraphQLErrors) => R
    authenticationError: (errors: GraphQLErrors) => R
    authorizationError: (errors: GraphQLErrors) => R
    validationError: (errors: GraphQLErrors) => R
    networkError: (error: Exclude<NetworkError, null>) => R
  }> & {
    _default: () => R
  }
): R => {
  if (!isNullish(error)) {
    // Network Error
    if (!isNullish(error.networkError)) {
      return !isNullish(supplier.networkError)
        ? supplier.networkError(error.networkError)
        : supplier._default()
    }

    // GraphQL Errors
    if (!isNullish(error.graphQLErrors) && isNotBlank(error.graphQLErrors)) {
      const gqlErrors = error.graphQLErrors

      let errors: GraphQLErrors
      if (isNotBlank((errors = filterGqlError(gqlErrors, GqlErrorType['InternalServerError'])))) {
        if (!isNullish(supplier.internalServerError)) return supplier.internalServerError(errors)
      }
      if (isNotBlank((errors = filterGqlError(gqlErrors, GqlErrorType['AuthenticationError'])))) {
        if (!isNullish(supplier.authenticationError)) return supplier.authenticationError(errors)
      }
      if (isNotBlank((errors = filterGqlError(gqlErrors, GqlErrorType['AuthorizationError'])))) {
        if (!isNullish(supplier.authorizationError)) return supplier.authorizationError(errors)
      }
      if (isNotBlank((errors = filterGqlError(gqlErrors, GqlErrorType['ValidationError'])))) {
        if (!isNullish(supplier.validationError)) return supplier.validationError(errors)
      }
      return supplier._default()
    }
  }

  // no error
  return !isNullish(supplier.noError) ? supplier.noError() : supplier._default()
}

/**
 * エラーのログ出力
 * サーバーにエラー内容を送信する必要がある場合、ここで行う
 *
 * @param errorResponse - onErrorリンクの引数のErrorHandlerに渡されるレスポンスオブジェクト
 */
export const report = (errorResponse: ErrorResponse): void => {
  let details: string | undefined

  const formatter: Parameters<typeof handle>[1] = {
    networkError: (error) => {
      details = `[NetworkError]: ${error}`
    },
    internalServerError: (errors) => {
      const formattedErrors = errors.map(
        ({ message, locations, path, extensions }) =>
          `[InternalServerError]: Message: ${message}, Location: ${JSON.stringify(locations)},` +
          ` Path: ${JSON.stringify(path)}, Extensions: ${JSON.stringify(extensions)}`
      )
      details = formattedErrors.join('\n')
    },
    _default: () => {
      /* do nothing */
    }
  }

  handle(errorResponse, formatter)

  if (!isNullish(details)) {
    // サーバーにエラー内容を送信する必要がある場合、ここでリクエストを発行する
    // const report = { context: typeof window === 'undefined' ? 'node' : navigator?.userAgent, details }
    // request(report)
    console.error('Application Error')
    console.error(details)
  }
}

/**
 * GraphQLErrorの配列からextensions.typeに指定の種別を持つエラーを抽出する
 *
 * @param errors - GraphQLErrors
 * @param type - 抽出対象のエラー種別
 * @returns extensions.typeに指定typeを持つエラーの配列
 */
const filterGqlError = (errors: GraphQLErrors, type: keyof typeof GqlErrorType) =>
  errors.filter((e) => e.extensions['type'] === type)
