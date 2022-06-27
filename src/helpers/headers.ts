import { isPlainObject } from '../utils'
import { HeadersType } from '../types'

function normalizeHeaderName(headers: HeadersType, normalizedName: string): void {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: HeadersType, data: any) {
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
    let [key, value] = item.split(':')
    key = key.trim().toLowerCase()
    if (!key) return
    if (value) value = value.trim()
    parsed[key] = value
  })
  return parsed as HeadersType
}
