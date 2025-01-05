import type { NextFunction, Request, Response } from 'express'

import { BadContentMediaTypeError, BadRequestedMediaTypeError } from '../utils/errors'


// TODO: rewrite functions so they are configurable, e.g. ability to set what types and header values we want to enforce/allow and if its to be enforced (e.g. if strict application/json then */* or if missing, fails) or lenient (e.g. if application/json then */* or if missing, goes forth and returns application/json)

export const enforceHeaderContentTypeAsJson = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type']

    // throw if Content-Type not specified or is not application/json
    if (!contentType || !contentType.includes('application/json')) // TODO: makes it not work in web browser??
      throw new BadContentMediaTypeError({ message: `Unsupported Media Type. Use 'application/json'.` })
  }

  res.setHeader('Content-Type', 'application/json')
  next()
}

export const enforceAcceptAsJson = (req: Request, _: Response, next: NextFunction) => {
  const accept = req.headers['accept']

  // throw if Accept specified and has value different than */*
  if (accept && !accept.includes('*/*') && !accept.includes('application/json'))
    throw new BadRequestedMediaTypeError({ message: `Not Acceptable Media Type. Use 'application/json'.` })

  next()
}