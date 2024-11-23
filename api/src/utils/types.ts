import { INote, IPhysicalNote, IScale, IScaleExt, ISound } from "api-types"
import { log } from "./logger"

export const isNote = (obj: any): obj is INote =>
  'name' in obj && typeof obj.name === 'string'

export const isPhysicalNote = (obj: any): obj is IPhysicalNote => 
  isNote(obj) &&
  'octave' in obj && typeof obj.octave === 'number'

export const isSound = (obj: any): obj is ISound => 
  isPhysicalNote(obj) && 
  'pitch' in obj && typeof obj.pitch === 'number'

export const isScale = (obj: any): obj is IScale =>
  'name' in obj &&      typeof obj.name === 'string' &&
  'keywords' in obj &&  Array.isArray(obj.keywords) &&
  'steps' in obj &&     Array.isArray(obj.steps)

export const isScaleExt = (obj: any): obj is IScaleExt => 
  'name' in obj &&      typeof obj.name === 'string' &&
  'keywords' in obj &&  Array.isArray(obj.keywords) &&
  'key' in obj &&       typeof obj.key === 'string' && 
  'notes' in obj &&     Array.isArray(obj.notes)

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

function isType<T>(ref: T, value: unknown): value is T {
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

export function getPrintableInterfaceType<T extends NonNullable<object>>(obj: NonNullable<T>): any {
  const newObj: { [key: string]: string | object } = {}

  Object.entries(obj).forEach(([key, value]) => {
    newObj[key] = getPrintableType(value)
  })

  return newObj
}

function getPrintableType(value: any): any {
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
