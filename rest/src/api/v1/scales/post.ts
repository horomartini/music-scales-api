import type { Request, Response, NextFunction } from 'express'
import type { GetScaleResponse } from 'proto/__generated__/scale'
import type { ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC } from 'middleware/request'

import { checkBody } from 'utils/requests'
import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'
import { SchemaDefinition } from 'utils/parser'

import grpc from 'proto/grpc'


type Scale = Exclude<GetScaleResponse['scale'], undefined>

const scales = Router()

/**
 * @swagger
 *  /scales/{id}:
 *  post:
 *    operationId: postScale
 *    tags: 
 *      - scales
 *    summary: Add scale
 *    description: Add scale with specified body. ID is generated automatically.
 *    parameters:
 *      - $ref: '#/components/parameters/noData'
 *    requestBody:
 *      $ref: '#/components/requests/scaleBody'
 *    responses:
 *      201:
 *        description: Scale that was created.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success: 
 *                  type: boolean
 *                data: 
 *                  $ref: '#/components/responses/scaleData'
 *              required:
 *                - success
 *                - data
 *      204:
 *        $ref: '#/components/responses/noData'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
scales.post('/',
  checkGRPC,
  (_: Request, res: Response<ResponseBody<Scale | null>, { data: Scale | null, schema: SchemaDefinition }>, next: NextFunction) => {
    res.locals.schema = {
      name: { type: String, required: true },
      steps: { type: Array, required: true, schema: { type: Number, required: true } },
    }

    next()
  },
  checkBody,
  async (req: Request, res: Response<ResponseBody<Scale | null>, { data: Scale | null, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Scale!.req.add(req.body)

    try {
      const response = await grpc.Client.Scale!.add(request)
      res.locals.data = response.scale ?? null
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    if (res.locals?.data === undefined)
      res.locals.data = null

    next()
  },
  checkGRPCErrors,
  (req: Request, res: Response<ResponseBody<Scale | null>, { data: Scale | null }>) => {
    if (req.query?.no_data && req.query.no_data === 'true')
      res.sendStatus(204)
    else
      res.status(201).type('application/json').json({ success: true, data: res.locals.data })
  }
)

export default scales
