import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('auth', () => {
    beforeEach(() => {
        jasmine.Ajax.install()
    })

    afterEach(() => {
        jasmine.Ajax.uninstall()
    })

    test('should accept HTTP Basic auth with username/password', () => {
        axios('/foo', {
            auth: {
                username: 'andy',
                password: '123456'
            }
        })

        return getAjaxRequest().then(request => {
            expect(request.requestHeaders['Authorization']).toBe('Basic YW5keToxMjM0NTY=')
        })
    })

    test('should fail to encode HTTP Basic auth credentials with non-Latin1 characters', () => {
        return axios('/foo', {
            auth: {
                username: 'Aladßç£☃din',
                password: '123456'
            }
        })
            .then(() => {
                throw new Error(
                    'Should not succeed to make a HTTP Basic auth request with non-latin1 chars in credentials.'
                )
            })
            .catch(error => {
                expect(/character/i.test(error.message)).toBeTruthy()
            })
    })
})