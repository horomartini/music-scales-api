import type { Request, Response, NextFunction } from 'express'
import { log } from '../utils/logger'
import { ResponseError } from '../types/errors'

export const globalErrorHandler = (
  err: Error, 
  _req: Request, 
  res: Response,
  _next: NextFunction,
) => {
  log('error', err.stack || err)

  if (err instanceof ResponseError) 
    res
      .status(err.code)
      .json({
        success: false,
        message: err.message,
        ...(err.expected ? { expected: err.expected } : {})
      })
  
  else
    res
      .status(500)
      .json({ 
        success:false, 
        message: 'An unexpected error occured.' 
      })
}