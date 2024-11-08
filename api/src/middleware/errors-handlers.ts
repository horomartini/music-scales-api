import type { Request, Response, NextFunction } from 'express'
import { log } from '../utils/logger'

export const globalErrorHandler = (
  err: any, 
  _req: Request, 
  res: Response,
  _next: NextFunction,
) => {
  log('error', err)
  res
    .status(500)
    .json({ error: 'An unexpected error occured.' })
}