import { AxiosRequestConfig, AxiosResponse } from '../types'

class AxiosError extends Error {
  public isAxiosError: boolean

  /* istanbul ignore next */
  constructor(
    message: string,
    public config: AxiosRequestConfig,
    public code?: string | null,
    public request?: XMLHttpRequest,
    public response?: AxiosResponse
  ) {
    super(message)
    this.isAxiosError = true
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: XMLHttpRequest,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, config, code, request, response)
  return error
}
