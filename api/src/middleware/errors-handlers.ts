import type { Request, Response, NextFunction } from 'express'

import { Log } from '../utils/logger'
import { BadBodySchemaError, BadParamError, ExtendedError } from '../utils/errors'

export const globalErrorHandler = (
  err: ExtendedError, 
  _req: Request, 
  res: Response,
  _next: NextFunction,
) => {
  const name = err.name
  const message = err.message
  const stack = err?.stack || `${name}: ${message}\n\t at undefined`
  const status = err?.status || 500
  const type = err?.type
  const body = err?.body || ''
  const schema = err?.schema || ''

  Log.error(`[${status} :: <${type}>] ${stack}`)

  if (err instanceof BadParamError && type === 'param.schema.failed')
    res
      .status(status)
      .json({
        success: false,
        message: message,
        expected: schema,
      })
  
  else if (err instanceof BadBodySchemaError && type === 'body.schema.failed')
    res
      .status(status)
      .json({
        success: false, 
        message: message,
        body: body,
        expected: schema,
      })

  else if (status === 400 && type === 'entity.parse.failed') { // TODO: make this in enum?
    res
      .status(status)
      .json({ 
        success: false, 
        message: 'Error parsing request body.', // TODO: better hints?
      })
  }
  
  else
    res
      .status(500)
      .json({ 
        success: false, 
        message: 'An unexpected error occured.' 
      })
}