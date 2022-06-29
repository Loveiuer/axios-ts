import { processHeaders, parseResponseHeaders, flattenHeaders } from '../../src/helpers/headers'
import { HeadersType } from '../../src/types'

describe('helpers:headers', () => {
    describe('processHeaders', () => {
        test('should normalize Content-Type header name', () => {
            const headers: HeadersType = {
                'conTENT-tYpe': 'foo/bar',
                'Content-length': 1024
            }
            processHeaders(headers, {})
            expect(headers['Content-Type']).toBe('foo/bar')
            expect(headers['conTENT-tYpe']).toBeUndefined()
            expect(headers['Content-length']).toBe(1024)
        })

        test('should set Content-Type if not set and data is PlainObject', () => {
            const headers: HeadersType = {}
            processHeaders(headers, { foo: 1 })
            expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
        })

        test('should set not Content-Type if not set and data is not PlainObject', () => {
            const headers: HeadersType = {}
            processHeaders(headers, new FormData())
            expect(headers['Content-Type']).toBeUndefined()
        })

        test('should do nothing if headers is undefined or null', () => {
            expect(processHeaders(undefined, {})).toBeUndefined()
            expect(processHeaders(null, {})).toBeNull()
        })
    })

    describe('parseResponseHeaders', () => {
        test('should parse headers', () => {
            const parsed = parseResponseHeaders(
                'Content-Type: application/json\r\n' +
                'Connection: keep-alive\r\n' +
                'Transfer-Encoding: chunked\r\n' +
                'Date: Tue Jun 28 2022 15:49:11 GMT+0800\r\n' +
                ':aa\r\n' +
                'key:'
            )
            expect(parsed['content-type']).toBe('application/json')
            expect(parsed['connection']).toBe('keep-alive')
            expect(parsed['transfer-encoding']).toBe('chunked')
            expect(parsed['date']).toBe('Tue Jun 28 2022 15:49:11 GMT+0800')
            expect(parsed['key']).toBe('')
        })

        test('should return empty object if headers is empty string', () => {
            expect(parseResponseHeaders('')).toEqual({})
        })
    })

    describe('flattenHeaders', () => {
        test('should flatten the headers and include common headers', () => {
            const headers: HeadersType = {
                Accept: 'application/json, text/plain, */*',
                common: {
                    'X-COMMON-HEADER': 'commonHeaderValue',
                    Accept: 'application/json'
                },
                get: {
                    'X-GET-HEADER': 'getHeaderValue',
                    Accept: 'text/plain'
                },
                post: {
                    'X-POST-HEADER': 'postHeaderValue'
                }
            }

            expect(flattenHeaders(headers, 'get')).toEqual({
                Accept: 'application/json, text/plain, */*',
                'X-COMMON-HEADER': 'commonHeaderValue',
                'X-GET-HEADER': 'getHeaderValue'
            })
        })

        test('should flatten the headers without common headers', () => {
            const headers: HeadersType = {
                Accept: 'application/json',
                get: {
                    'X-GET-HEADER': 'getHeaderValue'
                }
            }

            expect(flattenHeaders(headers, 'patch')).toEqual({
                Accept: 'application/json'
            })
        })
    })
})