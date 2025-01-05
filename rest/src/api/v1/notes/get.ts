import type { Request, Response, NextFunction } from 'express'

import { Router } from 'express'
import { checkGRPC } from 'middleware/request'

import grpc from 'proto/grpc'


const notes = Router()

notes.get('/',
  checkGRPC,
  async (_: Request, res: Response, next: NextFunction) => {
    if (grpc.Client.Note === undefined)
      throw new Error('Cannot fetch data from gRPC - client services are undefined')

    const request = grpc.Client.Note.req.getMany()
    const response = await grpc.Client.Note.getMany(request)

    res.status(200).json(response.notes)
  }
)

notes.get('/:id',
)


export default notes
