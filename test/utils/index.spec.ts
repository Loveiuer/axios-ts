import {
    isDate,
    isFormData,
    isPlainObject,
    isURLSearchParams,
    isFunction,
    extend,
    deepMerge
} from "../../src/utils";

describe('utils:index', () => {
    describe('isXXX', () => {
        test('should validate Date', () => {
            expect(isDate(new Date())).toBeTruthy()
            expect(isDate(Date.now())).toBeFalsy()
        })

        test('should validate PlainObject', () => {
            expect(isPlainObject({})).toBeTruthy()
            expect(isPlainObject(new Date())).toBeFalsy()
            expect(isPlainObject(new Map())).toBeFalsy()
            expect(isPlainObject(new FormData())).toBeFalsy()
        })

        test('should validate FormData', () => {
            expect(isFormData(new FormData())).toBeTruthy()
            expect(isFormData({})).toBeFalsy()
        })

        test('should validate Function', () => {
            expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
            expect(isURLSearchParams('string')).toBeFalsy()
        })

        test('should validate Function', () => {
            expect(isFunction(() => { })).toBeTruthy()
            expect(isFunction({})).toBeFalsy()
        })
    })

    describe('extend', () => {
        test('should be mutable', () => {
            const a = Object.create(null)
            const b = { foo: 666 }
            extend(a, b)
            expect(a.foo).toBe(666)
        })

        test('should extend properties', () => {
            const a = { foo: 333, bar: 666 }
            const b = { bar: 999 }
            const c = extend(a, b)
            expect(c.foo).toBe(333)
            expect(c.bar).toBe(999)
        })

        test('should extend prototype', () => {
            class A {
                constructor(public foo: number) { }
                public bar() {
                    return 666
                }
            }
            const a = new A(333)
            const b = { baz: 999 }
            const c = extend(a, b)
            expect(c.foo).toBe(333)
            expect(isFunction(c.bar)).toBeTruthy()
            expect(c.bar()).toBe(666)
            expect(c.baz).toBe(999)
        })
    })

    describe('deepMerge', () => {
        test('should be immutable', () => {
            const a = Object.create(null)
            const b: any = { foo: 333 }
            const c: any = { bar: 666 }
            deepMerge(a, b, c)
            expect(typeof a.foo).toBe('undefined')
            expect(typeof a.bar).toBe('undefined')
            expect(typeof b.bar).toBe('undefined')
            expect(typeof c.foo).toBe('undefined')
        })

        test('should deepMerge properties', () => {
            const a = { foo: 999 }
            const b = { bar: 333 }
            const c = { foo: 666 }
            const d = deepMerge(a, b, c)
            expect(d.foo).toBe(666)
            expect(d.bar).toBe(333)
        })

        test('should deepMerge recursively', () => {
            const a = { foo: { bar: 333 }, bar: 555 }
            const b = { foo: { bar: 666, baz: 777 }, bar: { qux: 999 }, boo: { seu: 111 } }
            const c = deepMerge(a, b)
            expect(c).toEqual({
                foo: {
                    bar: 666,
                    baz: 777
                },
                bar: {
                    qux: 999
                },
                boo: {
                    seu: 111
                }
            })
        })

        test('should remove all references from nested objects', () => {
            const a = { foo: { bar: 333 }, bar: 555 }
            const b = {}
            const c = deepMerge(a, b)
            expect(c).toEqual({
                foo: {
                    bar: 333,
                },
                bar: 555
            })
            expect(c.foo).not.toBe(a.foo)
        })

        test('should handle null and undefined arguments', () => {
            expect(deepMerge(undefined, undefined)).toEqual({})
            expect(deepMerge(undefined, { foo: 333 })).toEqual({ foo: 333 })
            expect(deepMerge({ foo: 333 }, undefined)).toEqual({ foo: 333 })

            expect(deepMerge(null, null)).toEqual({})
            expect(deepMerge(null, { foo: 333 })).toEqual({ foo: 333 })
            expect(deepMerge({ foo: 333 }, null)).toEqual({ foo: 333 })
        })
    })
})