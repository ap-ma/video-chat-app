import { GraphQLErrors, NetworkError } from '@apollo/client/errors'
import { ErrorResponse } from '@apollo/client/link/error'
import { isBlank, isNode, isNullish } from 'utils'

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
    if (!isNullish(error.graphQLErrors) && !isBlank(error.graphQLErrors)) {
      const gqlErrors = error.graphQLErrors

      let errors: GraphQLErrors
      if (!isBlank((errors = filterGqlError(gqlErrors, GqlErrorType['InternalServerError'])))) {
        if (!isNullish(supplier.internalServerError)) return supplier.internalServerError(errors)
      }
      if (!isBlank((errors = filterGqlError(gqlErrors, GqlErrorType['AuthenticationError'])))) {
        if (!isNullish(supplier.authenticationError)) return supplier.authenticationError(errors)
      }
      if (!isBlank((errors = filterGqlError(gqlErrors, GqlErrorType['AuthorizationError'])))) {
        if (!isNullish(supplier.authorizationError)) return supplier.authorizationError(errors)
      }
      if (!isBlank((errors = filterGqlError(gqlErrors, GqlErrorType['ValidationError'])))) {
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
 * サーバーにエラー内容を送信する必要がある場合、こちらで行う
 *
 * @param errorResponse - onErrorリンクの引数のErrorHandlerに渡されるレスポンスオブジェクト
 */
export const report = (errorResponse: ErrorResponse): void => {
  let details: string | undefined

  handle(errorResponse, {
    networkError: (error) => {
      details = `[NetworkError]: ${error}`
    },
    internalServerError: (errors) => {
      details = errors
        .map(({ message, locations, path, extensions }) => {
          const locationsJSON = JSON.stringify(locations)
          const pathJSON = JSON.stringify(path)
          const extensionsJSON = JSON.stringify(extensions)
          return `[InternalServerError]: Message: ${message}, Location: ${locationsJSON}, Path: ${pathJSON}, Extensions: ${extensionsJSON}`
        })
        .join('\n')
    },
    _default: () => {
      /* do nothing */
    }
  })

  if (!isNullish(details)) {
    const report = { context: isNode() ? 'node' : navigator?.userAgent, details }
    // サーバーにエラー内容を送信する必要がある場合、ここでリクエストを発行する
    console.error(`Application Error: ${JSON.stringify(report)}`)
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
