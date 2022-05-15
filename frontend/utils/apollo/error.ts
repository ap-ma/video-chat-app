import { GraphQLErrors, NetworkError } from '@apollo/client/errors'
import { ErrorResponse } from '@apollo/client/link/error'
import { API_ERROR_TYPE } from 'const'
import { isArray } from 'lodash'
import { AuthenticationErrors, AuthorizationErrors, ServerErrors, ValidationErrors } from 'types'
import { hasProperty, isNonEmptyArray as isNotBlank, isNullish } from 'utils/general/object'

/**
 * Operation Handler
 * エラー種別に応じて実行される関数をプロパティに持つオブジェクト
 */
export type Handler<R> = Partial<{
  noError: () => R
  internalServerError: (errors: ServerErrors) => R
  authenticationError: (errors: AuthenticationErrors) => R
  authorizationError: (errors: AuthorizationErrors) => R
  validationError: (errors: ValidationErrors) => R
  networkError: (error: Exclude<NetworkError, null>) => R
}> & {
  _default: () => R
}

/**
 * ApolloErrorのエラー種別に応じた指定関数の実行結果を返す
 * 対象エラー種別の関数が未定義の場合、_defaultの実行結果を返す
 *
 * @param error - ApolloError
 * @param handler - Operation Handler
 * @returns エラー種別に応じた関数の実行結果
 */
export const handle = <R>(
  error: Partial<{ networkError: NetworkError; graphQLErrors: GraphQLErrors }> | undefined,
  handler: Handler<R>
): R => {
  if (!isNullish(error)) {
    // Network Error
    if (!isNullish(error.networkError)) {
      return !isNullish(handler.networkError) ? handler.networkError(error.networkError) : handler._default()
    }
    // GraphQL Errors
    if (!isNullish(error.graphQLErrors) && isNotBlank(error.graphQLErrors)) {
      const gqlErrors = error.graphQLErrors

      let errors: GraphQLErrors
      if (isNotBlank((errors = filterGqlError(gqlErrors, API_ERROR_TYPE.INTERNAL_SERVER_ERROR)))) {
        if (!isNullish(handler.internalServerError)) {
          const serverErrors = errors as unknown as ServerErrors
          return handler.internalServerError(serverErrors)
        }
      }
      if (isNotBlank((errors = filterGqlError(gqlErrors, API_ERROR_TYPE.AUTHENTICATION_ERROR)))) {
        if (!isNullish(handler.authenticationError)) {
          const authenticationErrors = errors as unknown as AuthenticationErrors
          return handler.authenticationError(authenticationErrors)
        }
      }
      if (isNotBlank((errors = filterGqlError(gqlErrors, API_ERROR_TYPE.AUTHORIZATION_ERROR)))) {
        if (!isNullish(handler.authorizationError)) {
          const authorizationErrors = errors as unknown as AuthorizationErrors
          return handler.authorizationError(authorizationErrors)
        }
      }
      if (isNotBlank((errors = filterGqlError(gqlErrors, API_ERROR_TYPE.VALIDATION_ERROR)))) {
        if (!isNullish(handler.validationError)) {
          const validationErrors = errors as unknown as ValidationErrors
          return handler.validationError(validationErrors)
        }
      }
      return handler._default()
    }
  }

  // no error
  return !isNullish(handler.noError) ? handler.noError() : handler._default()
}

/**
 * エラーのログ出力
 * サーバーにエラー内容を送信する必要がある場合、ここで行う
 *
 * @param errorResponse - onErrorリンクの引数のErrorHandlerに渡されるレスポンスオブジェクト
 */
export const report = (errorResponse: ErrorResponse): void => {
  let details: string | undefined

  const formatter: Handler<void> = {
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
 * 指定の値がValidationErrorを表すGraphQLErrorsか否かを示す真偽値を返す
 *
 * @param target - 判定対象の値
 * @returns ValidationErrorを表すGraphQLErrorsか否かを示す真偽値
 */
export const isValidationErrors = (target: unknown): target is ValidationErrors => {
  if (isNullish(target) || !isArray(target)) return false
  for (const element of target) {
    const extensions = 'extensions'
    if (hasProperty(element, extensions)) {
      const type = element[extensions].type
      if (isNullish(type)) return false
      if (API_ERROR_TYPE.VALIDATION_ERROR !== type) return false
    }
  }

  return true
}

/**
 * GraphQLErrorの配列からextensions.typeに指定の種別を持つエラーを抽出する
 *
 * @param errors - GraphQLErrors
 * @param type - 抽出対象のエラー種別
 * @returns extensions.typeに指定typeを持つエラーの配列
 */
const filterGqlError = (errors: GraphQLErrors, type: typeof API_ERROR_TYPE[keyof typeof API_ERROR_TYPE]) =>
  errors.filter((e) => e.extensions?.type === type)
