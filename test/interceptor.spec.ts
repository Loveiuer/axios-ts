import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('interceptors', () => {
    beforeEach(() => {
        jasmine.Ajax.install()
    })
    afterEach(() => {
        jasmine.Ajax.uninstall()
    })

    test('should add a request interceptor', () => {
        const instance = axios.create()
        instance.interceptors.request.use((config: AxiosRequestConfig) => {
            config.headers!.test = 'added by interceptor'
            return config
        })

        instance('/foo')
        return getAjaxRequest().then(request => {
            expect(request.requestHeaders.test).toBe('added by interceptor')
        })
    })

    test('should add a request interceptor that returns a new config object', () => {
        const instance = axios.create()
        instance.interceptors.request.use(() => {
            return {
                url: '/bar',
                method: 'POST'
            }
        })
        instance('foo').then(response => {
            expect(response.config.method).toBe('post')
        })
        return getAjaxRequest().then(request => {
            request.respondWith({
                status: 200
            })
            expect(request.url).toBe('/bar')
            expect(request.method).toBe('POST')
        })
    })

    test('should add a request interceptor that returns a promise', done => {
        const instance = axios.create()
        instance.interceptors.request.use((config: AxiosRequestConfig) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    config.headers!.async = 'promise'
                    resolve(config)
                }, 10)
            })
        })
        instance('/foo')
        setTimeout(() => {
            getAjaxRequest().then(request => {
                expect(request.requestHeaders.async).toBe('promise')
                done()
            })
        }, 100)
    })

    test('should add multiple request interceptors', () => {
        const instance = axios.create()

        instance.interceptors.request.use(config => {
            config.headers!.test1 = '1'
            return config
        })
        instance.interceptors.request.use(config => {
            config.headers!.test2 = '2'
            return config
        })
        instance.interceptors.request.use(config => {
            config.headers!.test3 = '3'
            return config
        })

        instance('/foo')

        return getAjaxRequest().then(request => {
            expect(request.requestHeaders.test1).toBe('1')
            expect(request.requestHeaders.test2).toBe('2')
            expect(request.requestHeaders.test3).toBe('3')
        })
    })

    test('should add a response interceptor', done => {
        let response: AxiosResponse
        const instance = axios.create()
        instance.interceptors.response.use(data => {
            data.data = data.data + ' - modified by interceptor'
            return data
        })
        instance('/foo').then(data => {
            response = data
        })
        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                responseText: 'OK'
            })

            setTimeout(() => {
                expect(response.data).toBe('OK - modified by interceptor')
                done()
            }, 200)
        })
    })

    test('should add a response interceptor that returns a new data object', done => {
        let response: AxiosResponse
        let req: XMLHttpRequest
        const instance = axios.create()

        instance.interceptors.response.use(() => {
            return {
                data: 'stuff',
                headers: {},
                status: 500,
                statusText: 'ERR',
                request: req,
                config: {}
            }
        })
        instance('/foo').then(res => {
            response = res
        })

        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                responseText: 'OK'
            })
            req = request
            setTimeout(() => {
                expect(response.data).toBe('stuff')
                expect(response.headers).toEqual({})
                expect(response.status).toBe(500)
                expect(response.statusText).toBe('ERR')
                expect(response.request).toEqual(expect.any(XMLHttpRequest))
                expect(response.config).toEqual({})
                done()
            }, 100)
        })
    })

    test('should add a response interceptor that returns a promise', done => {
        let response: AxiosResponse
        const instance = axios.create()

        instance.interceptors.response.use(data => {
            return new Promise(resolve => {
                // do something async
                setTimeout(() => {
                    data.data = 'you have been promised!'
                    resolve(data)
                }, 10)
            })
        })

        instance('/foo').then(res => {
            response = res
        })

        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                responseText: 'OK'
            })

            setTimeout(() => {
                expect(response.data).toBe('you have been promised!')
                done()
            }, 100)
        })
    })
    test('should add multiple response interceptors', done => {
        let response: AxiosResponse
        const instance = axios.create()

        instance.interceptors.response.use(data => {
            data.data = data.data + '1'
            return data
        })
        instance.interceptors.response.use(data => {
            data.data = data.data + '2'
            return data
        })
        instance.interceptors.response.use(data => {
            data.data = data.data + '3'
            return data
        })

        instance('/foo').then(data => {
            response = data
        })

        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                responseText: 'OK'
            })

            setTimeout(() => {
                expect(response.data).toBe('OK123')
                done()
            }, 100)
        })
    })

    test('should allow removing interceptors', done => {
        let response: AxiosResponse
        let intercept1: number, intercept2: number
        const instance = axios.create()

        instance.interceptors.request.use(config => {
            config.headers!.test += '1'
            return config
        })
        intercept2 = instance.interceptors.request.use(config => {
            config.headers!.test += '2'
            return config
        })
        instance.interceptors.request.use(config => {
            config.headers!.test += '3'
            return config
        })
        instance.interceptors.response.use(data => {
            data.data = data.data + '1'
            return data
        })
        intercept1 = instance.interceptors.response.use(data => {
            data.data = data.data + '2'
            return data
        })
        instance.interceptors.response.use(data => {
            data.data = data.data + '3'
            return data
        })

        instance.interceptors.request.eject(intercept2)
        instance.interceptors.response.eject(intercept1)
        instance.interceptors.response.eject(0)

        instance('/foo', { headers: { test: 'test' } }).then(data => {
            response = data
        })

        getAjaxRequest().then(request => {
            request.respondWith({
                status: 200,
                responseText: 'OK'
            })
            expect(request.requestHeaders.test).toBe('test31')
            setTimeout(() => {
                expect(response.data).toBe('OK3')
                expect(response.config.headers?.test).toBe('test31')
                done()
            }, 100)
        })
    })
})