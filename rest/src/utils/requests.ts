import type { Request, Response, NextFunction } from 'express'
import { BadBodySchemaError, MissingParamError } from './errors'
import { isType, SchemaDefinition } from './parser'


export type ParamUnknown = Record<string, string>

export type ParamId = {
  id: string
}


export type BodyUnknown = Record<string, unknown>


export type QueryUnknown = Record<string, string>

export type QueryFilter = {
  [field_operator: string]: string
}

export type QuerySort = {
  [field: string]: 'asc' | 'desc'
}

export type QueryPaginate = {
  page?: string
  limit?: string
}


export type LocalsUnknown = Record<string, unknown>


export const checkBody = <T extends object, U extends LocalsUnknown>(
  req: Request, 
  res: Response<{}, { schema: SchemaDefinition } & U>, 
  next: NextFunction,
) => {
  const data: T = req.body
  const schema = res.locals.schema

  if (!data)
    throw new Error('data required')

  if (!schema)
    throw new Error('schema unspecified')

  const isOfType = isType<T>(data, schema)

  if (!isOfType)
    throw new BadBodySchemaError({ message: 'bad body', body: '', schema: '' })

  next()
}

// export const checkBody = <T extends object, U extends LocalsUnknown>(
//   req: Request, 
//   res: Response<{}, { data: T, schema: SchemaDefinition } & U>, 
//   next: NextFunction,
// ) => {
//   const data = res.locals.data
//   const schema = res.locals.schema
  

//   if (!data || !schema)
//     throw new Error('res.locals.data and res.locals.schema need to be defined.')

//   const isOfType = isType(data, schema)

//   if (!isOfType)
//     throw new BadBodySchemaError({
//       body: objectToReadableString(data),
//       schema: objectToReadableString(schema),
//     })
  
//   next()
// }