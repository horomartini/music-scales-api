import type { Request, Response, NextFunction } from 'express'

import { ErrorTypes, BadBodySchemaError, BadHeaderError, BadParamError, ExtendedError, NotFoundError, MissingParamError } from '../utils/errors'

import Log from '@shared/logger'


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
  const type = err?.type || ErrorTypes.UNKNOWN
  const body = err?.body || ''
  const schema = err?.schema || ''

  Log.error(`[${status} :: <${type}>] ${stack}`)

  if (err instanceof NotFoundError && type === ErrorTypes.DB_FIND)
    res.status(status).json({
      success: false,
      error: message,
    })

  else if (err instanceof BadParamError && type === ErrorTypes.PARAM_INVALID)
    res.status(status).json({
      success: false,
      error: message,
      details: {
        expectedSchema: schema,
      },
    })
  
  else if (err instanceof MissingParamError && type === ErrorTypes.PARAM_REQUIRED)
    res.status(status).json({
      success: false,
      error: message,
    })
  
  else if (err instanceof BadBodySchemaError && type === ErrorTypes.BODY_INVALID)
    res.status(status).json({
      success: false, 
      error: message,
      details: {
        receivedBody: body,
        expectedSchema: schema,
      },
    })
  
  else if (err instanceof BadHeaderError && type?.includes('header'))
    res.status(status).json({
      success: false,
      error: message,
    })

  else if (status === 400 && type === ErrorTypes.ENTITY_PARSE) {
    res.status(status).json({ 
      success: false, 
      error: 'Error parsing request body.',
    })
  }
  
  else
    res.status(500).json({ 
      success: false, 
      error: 'An unexpected error occured.' 
    })
}