import type { Request, Response, NextFunction } from 'express'

import Log from '@shared/logger'

export const logger = (req: Request, res: Response,next: NextFunction) => {
  Log.info(req.method, req.url)
  Log.debug(req?.params, req?.body, req?.query, res?.locals)
  
  next()
}
