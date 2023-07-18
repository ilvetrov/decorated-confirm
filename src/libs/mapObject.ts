export default function mapObject<
  T extends Record<string | number | symbol, unknown>,
  Result,
>(
  origin: T,
  callback: (value: T[keyof T], key: keyof T) => Result,
): { [Key in keyof T]: Result } {
  const newObject = { ...origin } as { [Key in keyof T]: Result }

  Object.keys(origin).forEach((key: keyof T) => {
    newObject[key] = callback(origin[key], key)
  })

  return newObject
}
