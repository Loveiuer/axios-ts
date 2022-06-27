import { AxiosTransformer, HeadersType } from '../types'

export default function transform(
  data: any,
  headers: HeadersType,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) return data
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
