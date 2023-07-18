export function nonNullable<T>(
  value: T | undefined | null | void,
  msg?: string,
): T {
  if (value === undefined || value === null) {
    throw new TypeError(msg ?? `value is ${value}`)
  }

  return value
}

export function nonNullableFunc<T extends (...args: any[]) => any>(
  value: T,
  msg?: string,
): (...args: Parameters<T>) => Exclude<ReturnType<T>, undefined | null | void> {
  return (...args: any[]) => {
    const result = value(...args)

    if (result === undefined || result === null) {
      throw new TypeError(msg ?? `value is ${result}`)
    }

    return result
  }
}
