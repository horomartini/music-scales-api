import type { Request, Response, NextFunction } from 'express'
import type { LocalsUnknown } from './requests'
import { BadParamError, ErrorTypes, ExtendedError, NotFoundError, type ErrorData } from './errors'


// export type ResponseBody<T> = {
//   success: false
//   error: string
//   details?: ResponseErrorDetails
// } | T extends Array<infer U> ? {
//   success: true
//   data: Array<U>
//   paginationData?: PaginationData
// } : {
//   success: true
//   data: T
// }
export type ResponseBody<T> = {
  success: true
  data: T
  paginationData?: PaginationData
} | {
  success: false
  error: string
  details?: ResponseErrorDetails
}

export type PaginationData = {
  totalCount: number
  pagesCount: number
  nextPage: string
}

export type ResponseErrorDetails = {
  errorName?: string
  errorType?: string
  receivedBody?: string
  expectedSchema?: string
}


export const checkGRPCErrors = (
  _: Request,
  res: Response<unknown, { error?: ErrorData }>,
  next: NextFunction,
) => {
  const error = res.locals?.error

  if (error !== undefined) {
    if (!('type' in error))
      throw new ExtendedError(error)
    if (error.type === ErrorTypes.DB_FIND)
      throw new NotFoundError(error)
    if (error.type = ErrorTypes.PARAM_PARSE)
      throw new BadParamError(error)
  }

  res.locals.error = undefined

  next()
}
