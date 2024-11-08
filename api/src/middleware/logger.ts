import type { Request, Response, NextFunction } from 'express'
import { log } from '../utils/logger'

export const logger = (
  req: Request, 
  res: Response,
  next: NextFunction,
) => {
  log('info', req.method, req.url)
  next()
}