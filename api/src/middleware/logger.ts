import type { Request, Response, NextFunction } from 'express'

import { Log } from '../utils/logger'

export const logger = (
  req: Request, 
  res: Response,
  next: NextFunction,
) => {
  Log.info(req.method, req.url)
  if (req.url !== '/graphql') // Apollo Playground sends requests every 2 seconds - this eases with verbosity of debug logs
    Log.debug(req?.params, req?.body, req?.query, res?.locals)
  next()
}
