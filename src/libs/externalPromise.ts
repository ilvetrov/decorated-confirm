import { nonNullable } from './nonNullable'

export interface ExternalPromise<T> {
  resolve: (value: T) => void
  reject: (reason?: any) => void
  promise: Promise<T>
}

export default function externalPromise<T>(): ExternalPromise<T> {
  let resolve: ((value: T) => void) | undefined
  let reject: ((reason?: any) => void) | undefined

  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve
    reject = innerReject
  })

  return {
    resolve: nonNullable(resolve),
    reject: nonNullable(reject),
    promise,
  }
}
