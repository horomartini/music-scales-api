import type { Request, Response, NextFunction } from 'express'

import { getPrintableInterfaceType, isInterface } from '../utils/types'
import { ResponseError } from '../utils/errors'


export const checkBody = <T extends object>(
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