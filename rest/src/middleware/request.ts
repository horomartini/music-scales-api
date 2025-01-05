import type { Request, Response, NextFunction } from 'express'

import grpc from 'proto/grpc'


export const checkGRPC = (_: Request, __: Response, next: NextFunction) => {
  if (grpc.Client.Note === undefined)
    throw new Error('Cannot fetch data from gRPC - client services are undefined')

  next()
}
