import type { Request, Response, NextFunction, Locals } from 'express'

import { getPrintableInterfaceType, isInterface, isType, objectToReadableString, SchemaDefinition } from '../utils/types'
import { BadBodySchemaError, NotFoundError, ResponseError } from '../utils/errors'
import { ObjectIdField } from 'types/db'
import { ParamId } from 'types/req'


/**
 * @deprecated
 */
export const checkBodyOld = <T extends object>(
  _: Request, 
  res: Response<{}, { data: T | T[], expected: T }>, 
  next: NextFunction,
) => {
  const data = res.locals.data
  const expected = res.locals.expected

  const isCorrect = Array.isArray(data)
    ? data.map(obj => isInterface<T>(expected, obj)).every(Boolean)
    : isInterface<T>(expected, data)

  if (!isCorrect)
    throw new ResponseError(
      400, 
      `Wrong body given.`, 
      getPrintableInterfaceType(expected)
    )

  next()
}

/**
 * @deprecated
 */
export const checkBody = <T extends Object>(
  _: Request, 
  res: Response<{}, { data: T, schema: SchemaDefinition }>, 
  next: NextFunction,
) => {
  const data = res.locals.data
  const schema = res.locals.schema

  const isOfType = isType(data, schema)

  if (!isOfType)
    throw new BadBodySchemaError({
      body: objectToReadableString(data),
      schema: objectToReadableString(schema),
    })
  
  next()
}

export const checkLocalsData = <T extends object, U extends Locals = {}>(
  _: Request, 
  res: Response<{}, { data: T, schema: SchemaDefinition } & U>, 
  next: NextFunction,
) => {
  const data = res.locals.data
  const schema = res.locals.schema

  if (!data || !schema)
    throw new Error('res.locals.data and res.locals.schema need to be defined.')

  const isOfType = isType(data, schema)

  if (!isOfType)
    throw new BadBodySchemaError({
      body: objectToReadableString(data),
      schema: objectToReadableString(schema),
    })
  
  next()
}

export const checkIfFound = <T extends object & ObjectIdField>(
  _: Request, 
  res: Response<{}, { query?: Partial<T>, data: T | null }>,
  next: NextFunction,
) => {
  if (res.locals.data === null)
    throw new NotFoundError({ message: `Note ${res.locals.query?._id} not found.` })

  next()
}

export const checkIfExist = <T extends object & ObjectIdField>(
  req: Request<ParamId>, 
  res: Response<{}, { exists?: T }>,
  next: NextFunction,
) => {
  if (res.locals.exists === undefined)
    throw new NotFoundError({ message: `Note ${req.params.id} not found.` })

  next()
}
