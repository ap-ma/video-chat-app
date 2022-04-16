import { API_URL } from 'const'
import { isNullish } from 'utils/impl/object'

/** HTTP Request Method */
export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const

/** Http request header content-type */
export const ContentType = {
  URLENCODED: 'urlencoded',
  MULTIPART: 'multipart',
  JSON: 'json'
} as const

/**
 * Fetch APIを呼び出し、結果を返す
 *
 * @param method - Request Method
 * @param contentType - Content-Type
 * @param [url="定数: API_URL"] - URL文字列
 * @param [headers={}] - ヘッダーを表すオブジェクト
 * @param [parameters={}] - パラメータを表すオブジェクト
 * @returns responseをresolveの引数とするPromiseオブジェクト
 */
export const request = async (
  method: typeof Method[keyof typeof Method],
  contentType: typeof ContentType[keyof typeof ContentType],
  url = API_URL,
  headers: HeadersInit = {},
  parameters: Record<string, unknown> = {}
): Promise<Response> => {
  if (isNullish(url)) throw new TypeError('url is undefined.')
  const response = await fetch(url, {
    method,
    headers:
      contentType === ContentType.JSON
        ? { 'Content-Type': 'application/json', ...headers }
        : headers,
    body:
      method === Method.GET
        ? undefined
        : contentType === ContentType.URLENCODED
        ? createURLSearchParams(parameters)
        : contentType === ContentType.MULTIPART
        ? createFormData(parameters)
        : JSON.stringify(parameters)
  })
  if (!response.ok) throw new Error(response.statusText)
  return response
}

/**
 * URLSearchParamsオブジェクトの生成
 *
 * @param data - パラメータに追加する値のマッピング
 * @returns URLSearchParamsオブジェクト
 */
const createURLSearchParams = (data: Record<string, unknown>) => {
  const params = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    if (typeof key !== 'string' || typeof value !== 'string')
      throw new TypeError('The parameter type is invalid.')
    params.append(key, value)
  })
  return params
}

/**
 * FormDataオブジェクトの生成
 *
 * @param data -パラメータに追加する値のマッピング
 * @returns FormDataオブジェクト
 */
const createFormData = (data: Record<string, unknown>) => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (typeof key !== 'string' || (typeof value !== 'string' && !(value instanceof Blob)))
      throw new TypeError('The parameter type is invalid.')
    form.append(key, value)
  })
  return form
}
