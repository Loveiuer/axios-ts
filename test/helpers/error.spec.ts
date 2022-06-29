import { createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('helpers:error', () => {
    test('should create an Error with message, config, code, request, response and isAxiosError', () => {
        const request = new XMLHttpRequest()
        const config: AxiosRequestConfig = { method: 'post' }
        const response: AxiosResponse = {
            status: 200,
            statusText: 'OK',
            headers: {},
            request,
            config,
            data: { school: 'SEU' }
        }
        const error = createError('Boom!', config, 'SOMEERROR', request, response)
        expect(error instanceof Error).toBeTruthy()
        expect(error.message).toBe('Boom!')
        expect(error.config).toBe(config)
        expect(error.code).toBe('SOMEERROR')
        expect(error.request).toBe(request)
        expect(error.response).toBe(response)
        expect(error.isAxiosError).toBeTruthy()
    })
})