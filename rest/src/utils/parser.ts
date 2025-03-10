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

export type SchemaDefinition = 
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