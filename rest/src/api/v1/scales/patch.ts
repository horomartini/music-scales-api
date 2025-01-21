import type { Request, Response, NextFunction } from 'express'
import type { GetScaleResponse } from 'proto/__generated__/scale'
import type { ResponseBody } from 'utils/responses'
import type { ParamId } from 'utils/requests'

import { Router } from 'express'

import { checkGRPC } from 'middleware/request'

import { checkBody } from 'utils/requests'
import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'
import { SchemaDefinition } from 'utils/parser'

import grpc from 'proto/grpc'


type Scale = Exclude<GetScaleResponse['scale'], undefined>

const scales = Router()

scales.patch('/:id',
  () => {  console.log('1') },
  checkGRPC,
  (_: Request, res: Response<ResponseBody<Scale>, { data: Scale, schema: SchemaDefinition }>, next: NextFunction) => {
    res.locals.schema = {
      name: { type: String, required: false },
      steps: { type: Array, required: false, schema: { type: Number, required: true } }
    }

    next()
  },
  checkBody,
  async (req: Request<ParamId>, res: Response<ResponseBody<Scale>, { data: Scale, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Scale!.req.update({ ...req.body, id: req.params.id })

    try {
      const response = await grpc.Client.Scale!.update(request)
      res.locals.data = response.scale!
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    next()
  },
  checkGRPCErrors,
  (_: Request, res: Response<ResponseBody<Scale>, { data: Scale }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)

export default scales
