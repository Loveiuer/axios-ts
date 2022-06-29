import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../utils'

function defaultStrat(value1: any, value2: any): any {
  return typeof value2 !== 'undefined' ? value2 : value1
}

function fromValue2Strat(value1: any, value2: any): any {
  if (typeof value2 !== 'undefined') {
    return value2
  }
}

function deepMergeStrat(value1: any, value2: any): any {
  if (isPlainObject(value2)) {
    return deepMerge(value1, value2)
  } else if (isPlainObject(value1)) {
    return deepMerge(value1)
  }
}

const strats = Object.create(null)

const stratKeysFromValue2 = ['url', 'params', 'data']
stratKeysFromValue2.forEach(key => {
  strats[key] = fromValue2Strat
})

const stratKeysDeepMerge = ['headers', 'auth']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  config2 = config2 || {}
  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }
  for (let key in config1) {
    if (!config2[key as keyof AxiosRequestConfig]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(
      config1[key as keyof AxiosRequestConfig],
      config2![key as keyof AxiosRequestConfig]
    )
  }

  return config as AxiosRequestConfig
}
