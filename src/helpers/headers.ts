import { deepMerge, isPlainObject } from '../utils'
import { HeadersType, Method } from '../types'

function normalizeHeaderName(headers: HeadersType | undefined | null, normalizedName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: HeadersType | undefined | null, data: any) {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseResponseHeaders(responseHeaders: string): HeadersType {
  let parsed = Object.create(null)
  if (!responseHeaders) return parsed
  responseHeaders.split('\r\n').forEach(item => {
    let [key, ...values] = item.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    let value = values.join(':')
    if (value) value = value.trim()
    parsed[key] = value
  })
  return parsed as HeadersType
}

export function flattenHeaders(headers: HeadersType, method: Method): HeadersType {
  headers = deepMerge(headers?.common, headers && headers[method], headers)
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.forEach(method => {
    delete headers[method]
  })
  return headers
}

