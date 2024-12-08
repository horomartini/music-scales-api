import type { ObjectId } from 'types/db'

/**
 * Checks if given object is of the same type as given reference.
 * - reference needs to be a valid object and is treated like a type, e.g. `{ name: String(), loc: { lat: Number(), lon: Number() } }`
 * - use constructors of specific types in fields, e.g. `fieldName: String()`,
 * - use single value in arrays of many values, e.g. `fieldName: [Number()]`.
 * @todo support multi-type arrays, e.g. `[string | number]`
 */
export function isInterface<T extends NonNullable<object>>(ref: NonNullable<T>, obj: any): obj is T {
  if (typeof obj !== 'object') // cannot be non-object or null object
    return false

  const refKeys = Object.keys(ref)
  const objKeys = Object.keys(obj)

  if (refKeys.length !== objKeys.length) // if has same amount of properties
    return false

  for (const key of refKeys) {
    if (!objKeys.includes(key)) // if has same named properties
      return false

    const refValue = ref[key as keyof typeof ref]
    const objValue = obj[key as keyof typeof obj]
    const equalValueTypes = isType<typeof refValue>(refValue, objValue)

    if (!equalValueTypes) // if values of props of same names are also the same
      return false
  }

  return true
}

/**
 * Checks if given type is of the same type as given reference value, which is used for a type.
 * If an object is given, `isInterface` is called.
 */
export function isType<T>(ref: T, value: unknown): value is T {
  if (ref === null) // if both null, then was suppoused to be null, otherwise is a mistake
    return value === null

  if (Array.isArray(ref)) // check every item of value array to be all the same types
    return Array.isArray(value) 
      && value 
        .map(item => isType<typeof ref[0]>(ref[0], item))
        .every(res => res === true)

  if (typeof ref === 'object') // check object like it is a new interface
    return typeof value === 'object'
      && isInterface<typeof ref>(ref, value)
  
  return typeof ref === typeof value // check types of both primitive-ish values
}

/**
 * Returns an object in an easier-to-read form. Recurrency is used so keep in mind when passing big objects.
 */
export function getPrintableInterfaceType<T extends NonNullable<object>>(obj: NonNullable<T>): any {
  const newObj: { [key: string]: string | object } = {}

  Object.entries(obj).forEach(([key, value]) => {
    newObj[key] = getPrintableType(value)
  })

  return newObj
}

/**
 * Returns a value in an easier-to-read form. Recurrency is used so keep in mind when passing big objects.
 */
export function getPrintableType(value: any): any {
  if (value === null)
    return 'null'

  if (value === undefined)
    return 'undefined'

  if (Array.isArray(value))
    return `${getPrintableType(value?.[0])}[]`

  switch (typeof value) {
    case 'object': return `{${getPrintableInterfaceType<typeof value>(value)}}`
    case 'string': return 'string'
    case 'number': return 'number'
    default: 'undefined'
  }
}

/**
 * Converts string type to ObjectId type, when using strings as strict id types.
 */
export const stringToObjectId = (v: string): ObjectId => 
  (v as unknown) as ObjectId
