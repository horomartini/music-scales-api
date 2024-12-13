import type { Request, Response, NextFunction } from 'express'

import { getPrintableInterfaceType, isInterface, isType, objectToReadableString, SchemaDefinition } from '../utils/types'
import { BadBodySchemaError, ResponseError } from '../utils/errors'


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

export const checkBody = <T extends object, U>(
  _: Request, 
  res: Response<{}, { data: T, schema: SchemaDefinition } & U>, 
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
