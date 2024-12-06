import type { IPhysicalNote, INote, Pitch, ISound } from 'api-types'
import type { Request } from 'express'

import db from '../db/sample-db'
import { toSnakeCase } from './rest'


// export const getQueryParams = <T>(query: T, extract: { [K in keyof T]: T[K] }) => {
//   const result = {} as T

//   for (const key in extract) {
//     result[key] = (query?.[key] ?? extract[key])
//   }

//   return result
// }

const parseBoolean = (value: string | boolean | undefined, defaultValue: boolean): boolean =>
  value === undefined || [`${!defaultValue}`, !defaultValue].includes(value)
    ? !defaultValue
    : defaultValue

const parseNumber = (value: string | number | undefined, defaultValue: number): number => 
  Number(value) || defaultValue

const parseString = (value: string | undefined, defaultValue: string): string =>
  value === undefined || value === '' 
    ? defaultValue 
    : value

const parseArray = <T>(value: string | undefined, defaultValue: T[], parser: ((v: string) => T) | undefined = undefined, delimiter: string = ','): T[] => {
  if (value === undefined || value == '')
    return defaultValue
  
  const values = value.split(delimiter)

  if (values.some(v => typeof v === undefined))
    return defaultValue

  const types = defaultValue.map(v => typeof v)
  let result: T[] = []

  for (const v of values) {
    if (!types.includes(typeof v))
      return defaultValue

    if (parser !== undefined)
      result.push(parser(v))
    else
      result.push(v as T) // TODO: implement whats below in a smart way
    // const indexOfTypeOfV = types.indexOf(typeof v)
    // const typeOfV = types.find(t => typeof v === t)
    // switch (typeOfV) {
    //   case 'boolean': result.push(parseBoolean(v, defaultValue[indexOfTypeOfV as keyof typeof defaultValue]))
    //   case 'number':
    //   case 'string': 
    //   default:   
    // }
  }

  return result
}

// export const parseQueryParams = (
//   req: Record<string, string | undefined>, 
//   ref: Record<string, {
//     type: 
//   }>) => {

// }

// type QueryParamValues = { 
//   type: Function | Function[] | string[], 
//   defaultValue: unknown | null, 
//   parser?: (v: string) => unknown
// }

// export const parseQueryParams = (req: Record<string, string | undefined>, ref: Record<string, QueryParamValues>) => {
//   const isString = (v: unknown): v is String => v === String
//   const isNumber = (v: unknown): v is Number => v === Number
//   const isBoolean = (v: unknown): v is Boolean => v === Boolean
//   const isArray = <T>(v: unknown): v is Array<T> => Array.isArray(v)
//   const isObject = (v: unknown): v is Object => v === Object

//   const asStringLiteral = (type: string[], value: string | undefined, defaultValue: string): string => 
//     value !== undefined && type.includes(value)
//       ? value
//       : defaultValue

//   const asString = (value: string | undefined, defaultValue: string): string =>
//     value !== undefined && value === 'string'
//       ? value
//       : defaultValue

//   const reqMap: Map<string, string | undefined> = new Map(Object.entries(req))

//   const result: Record<string, unknown> = Object.entries(ref).reduce((acc, [key, { type, defaultValue, parser }]) => {
//     const reqKey: string = toSnakeCase(key)
//     const reqValue: string | undefined = reqMap.get(reqKey)

//     if (reqValue === undefined)
//       return { ...acc, [key]: defaultValue }

//     else if (Array.isArray(type)) {
//       if (type.every(item => typeof item === 'string')) {
//         // String Literal
//         return { ...acc, [key]: asStringLiteral(type, reqValue, defaultValue as string) }
//       }
//       else if (type.length !== 0 && type.every(item => typeof item === 'function')) {
//         const typeCaller = type[0]
//         return { ...acc, [key]: parser === undefined ? typeCaller(reqValue) : parser(reqValue) }
//       }
//     }

//     else {
//       const typeCaller = type
//       return { ...acc, [key]: parser === undefined ? typeCaller(reqValue) : parser(reqValue) }
//     }

//     return acc
//   }, {})

//   console.log(result)
// }

export const getQueryParams = (ref: NonNullable<Record<string, [any, any] | [any[], any] | [any[], any[], ((v: string) => any)]>>, req: Record<string, string>) => {
  const parsers = {
    'boolean': parseBoolean,
    'number': parseNumber,
    'string': parseString,
  }

  let result: Record<keyof typeof ref, any | any[]> = Object
    .keys(ref)
    .reduce((acc, key: string) => ({ ...acc, [key]: undefined }), {})

  for (const [name, [asType, defaultValue, parser]] of Object.entries(ref)) {
    const reqKey = toSnakeCase(name)
    const value = req?.[reqKey as keyof typeof req]
    const primitiveType = typeof asType

    // no query or invalid query given
    if (value === undefined || value === '' || typeof value !== 'string') {
      result[name] = Array.isArray(defaultValue) ? defaultValue?.[0] : defaultValue
      continue
    }

    // literal or array queries
    if (Array.isArray(asType)) {
      if (Array.isArray(defaultValue)) {
        // query is an array
        result[name] = parseArray(value, defaultValue, parser)
        continue
      } else { 
        // query is a literal / pick from hard-coded options
        const literalType = typeof (asType?.[0] === undefined ? defaultValue : asType[0])
        let parsed = defaultValue

        // if (literalType === 'boolean' && typeof defaultValue === 'boolean')
        //   parsed = parsers.boolean(value, defaultValue)
        // else if (literalType === 'number' && typeof defaultValue === 'number')
        //   parsed = parsers.number(value, defaultValue)
        // else if (literalType === 'string' && typeof defaultValue === 'string')
        //   parsed = parsers.string(value, defaultValue)

        // result[name] = parsed
        // continue
      }
    }

    if (primitiveType === 'boolean' && typeof defaultValue === 'boolean')
      result[name] = parseBoolean(value, defaultValue)
    else if (primitiveType === 'number' && typeof defaultValue === 'number')
      result[name] = parseNumber(value, defaultValue)
    else if (primitiveType === 'string' && typeof defaultValue === 'string')
      result[name] = parseString(value, defaultValue)
    else
      result[name] = defaultValue
  }

  return result
}

export const parseNote = (note: string): IPhysicalNote | INote => {
  if (note.includes('s'))
    note = note.replace('s', '#')

  if (/\d/.test(note))
    return {
      name: note.slice(0, -1),
      octave: Number(note.slice(-1)),
    } as IPhysicalNote
  return { name: note } as INote
}

export const parseNotes = (notes?: string): (IPhysicalNote | INote)[] => {
  if (notes === undefined)
    return []
  const notesArr: string[] = notes.split(',') || []
  const notesObjs: (IPhysicalNote | INote)[] = notesArr.map(parseNote)
  return notesObjs
}

export const parseNoteRef = (name: string, octave: number, pitch: Pitch): ISound => {
  const ogRef = db.getRef()

  if (name === '' || octave === -1 || pitch === -1) {
    if (ogRef === null || ogRef.sound === null)
      throw Error('Note reference in server database is null.')
    return ogRef.sound
  }

  return { name, octave, pitch } as ISound
}

export const parseBooleanQuery = (value: string | boolean | undefined): boolean => 
  value !== undefined && value !== 'false' && value !== false

export const parseDeactivatorQuery = (value: string | boolean | undefined): boolean =>
  value !== 'false' && value !== false

export const parseNumberQuery = (value: string | number | undefined): number =>
  value === undefined || isNaN(Number(value)) ? -1 : Number(value)

export const parseStringQuery = (value: string | undefined): string =>
  value === undefined ? '' : value

export const parseLiteralQuery = <T extends string>(value: string | undefined, or: string): T =>
  value === undefined ? <T>or : <T>value
