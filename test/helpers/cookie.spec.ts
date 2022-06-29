import cookie from '../../src/helpers/cookie'

describe('helpers:cookie', () => {
    test('should read cookies', () => {
        document.cookie = 'school=SEU'
        expect(cookie.read('school')).toBe('SEU')
    })

    test('should return null if cookie name is not exist', () => {
        document.cookie = 'school=SEU'
        expect(cookie.read('SEU')).toBeNull()
    })
})