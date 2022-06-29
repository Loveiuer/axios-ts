
const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isFunction(val: any): val is Function {
  return toString.call(val) === '[object Function]'
}

export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams
}

export function isFormData(val: any): val is FormData {
  const pattern = '[object FormData]'
  return (
    val &&
    ((typeof FormData === 'function' && val instanceof FormData) ||
      toString.call(val) === pattern ||
      (isFunction(val.toString) && val.toString() === pattern))
  )
}

export function extend<T extends object, K extends object>(to: T, from: K): T & K {
  for (let key in from) {
    ; (to as T & K)[key] = from[key] as any
  }
  return to as T & K
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        let value = obj[key]
        if (isPlainObject(value)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], value)
          } else {
            result[key] = deepMerge(value)
          }
        } else {
          result[key] = value
        }
      })
    }
  })
  return result
}

