import type { ObjectId } from 'types/db'

type Primitive<T> = 
  T extends StringConstructor ? string : 
  T extends NumberConstructor ? number : 
  T extends BooleanConstructor ? boolean : 
  T extends ArrayConstructor ? T extends Array<infer U> ? U[] : never[] : //always  never[]
  T extends ObjectContstructor ? object : // always object | never[]
  never

type PrimitiveConstructor = 
  | StringConstructor 
  | NumberConstructor 
  | BooleanConstructor

type ObjectContstructor = 
  | ArrayConstructor 
  | ObjectConstructor

type SchemaPrimitiveType = {
  type: PrimitiveConstructor
  required?: boolean
}

type SchemaObjectType = {
  type: ObjectContstructor
  required?: boolean
  schema: SchemaDefinition
}

type SchemaDefinition = 
  | SchemaPrimitiveType
  | SchemaObjectType
  | Record<string, SchemaPrimitiveType | SchemaObjectType>


const isSchemaObjectType = (def: SchemaDefinition): def is SchemaObjectType => 
  'type' in def && 'schema' in def && Object.keys(def).length < 4

const isSchemaPrimitiveType = (def: SchemaDefinition): def is SchemaPrimitiveType =>
  'type' in def && Object.keys(def).length < 3


export const isType = <T>(value: unknown, def: SchemaDefinition): value is T => {
  const isRequired = 'required' in def && def.required === true

  if (isSchemaObjectType(def)) { // repeating object -> { type: ObjectConstructor, ... }: SchemaObjectType
    if (value === null || value === undefined) // if values unset, check if they are required
      return !isRequired 

    const defIsArray = Array.isArray(def.type())
    const valueIsArray = Array.isArray(value)
    
    const isTypeForItems = (items: unknown[]) => items.every(item => isType(item, def.schema)) // check type of every value
    const areTypesOfOptionalItems = (items: unknown[]) => isRequired 
      ? items.length > 0 && isTypeForItems(items) // if items are required, check if they exist and if they match schema
      : items.length < 1 || isTypeForItems(items) // else, check if there are any items and if there are, check if they match schema

    if (defIsArray && valueIsArray) // [1, 2] -> { type: Array, schema: { type: Number } }
      return areTypesOfOptionalItems(value)
    
    if (typeof def.type() === 'object' && typeof value === 'object' && !defIsArray && !valueIsArray) // { a: '1', b: '2' } -> { type: Object, schema: { type: String } }
      return areTypesOfOptionalItems(Object.values(value))

    return false
  } 
  else if (isSchemaPrimitiveType(def)) { // primitive value -> { type: PrimitiveConstructor }: SchemaPrimitiveType
    if (value === null || value === undefined) // if values unset, check if they are required
      return !isRequired 
    
    return typeof value === typeof def.type()
  } 
  else { // keys-varied object -> { [K as string]: SchemaPrimitiveType | SchemaObjectType }: Record<string, ?>
    if (value === null || value === undefined) // if values unset, check if they are required
      return !isRequired 

    if (typeof value !== 'object') // if not an object, should not be called unless of a bad implementation
      return false

    const valueKeys = Object.keys(value) // take all keys in given value
    const defRequiredKeys = Object // take only required keys in given schema definition
      .entries(def) 
      .filter(([_, schema]) => 'required' in schema && schema.required)
      .map(([prop]) => prop)
    const defOptionalKeys = Object // take only optional keys in given schema definition
      .entries(def)
      .filter(([_, schema]) => !('required' in schema && schema.required))
      .map(([prop]) => prop)
    
    const hasAllRequiredKeys = defRequiredKeys.every(key => valueKeys.includes(key))
    const hasOnlyRequiredOrOptionalKeys = valueKeys.every(item => defRequiredKeys.includes(item) || defOptionalKeys.includes(item))

    // does not have required properties or has more than those specified as required and optional
    if (valueKeys.length < defRequiredKeys.length || !hasAllRequiredKeys || !hasOnlyRequiredOrOptionalKeys)
      return false

    return Object
      .entries(value)
      .map(([key, value]) => [value, def[key]])
      .every(([value, schema]) => isType(value, schema))
  }
}

/**
 * Checks if given object is of the same type as given reference.
 * - reference needs to be a valid object and is treated like a type, e.g. `{ name: String(), loc: { lat: Number(), lon: Number() } }`
 * - use constructors of specific types in fields, e.g. `fieldName: String()`,
 * - use single value in arrays of many values, e.g. `fieldName: [Number()]`.
 * @todo support multi-type arrays, e.g. `[string | number]`
 * @deprecated
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
    const equalValueTypes = isTypeOld<typeof refValue>(refValue, objValue)

    if (!equalValueTypes) // if values of props of same names are also the same
      return false
  }

  return true
}

/**
 * Checks if given type is of the same type as given reference value, which is used for a type.
 * If an object is given, `isInterface` is called.
 * @deprecated
 */
export function isTypeOld<T>(ref: T, value: unknown): value is T {
  if (ref === null) // if both null, then was suppoused to be null, otherwise is a mistake
    return value === null

  if (Array.isArray(ref)) // check every item of value array to be all the same types
    return Array.isArray(value) 
      && value 
        .map(item => isTypeOld<typeof ref[0]>(ref[0], item))
        .every(res => res === true)

  if (typeof ref === 'object') // check object like it is a new interface
    return typeof value === 'object'
      && isInterface<typeof ref>(ref, value)
  
  return typeof ref === typeof value // check types of both primitive-ish values
}

/**
 * Returns an object in an easier-to-read form. Recurrency is used so keep in mind when passing big objects.
 * @deprecated
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
 * @deprecated
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
