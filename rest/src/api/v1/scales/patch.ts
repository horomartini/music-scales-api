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

/**
 * @swagger
 *  /scales/{id}:
 *  patch:
 *    operationId: patchScale
 *    tags: 
 *      - scales
 *    summary: Update scale
 *    description: Update chosen fields in Scale except for ID.
 *    parameters:
 *      - $ref: '#/components/parameters/scaleId'
 *      - $ref: '#/components/parameters/noData'
 *    requestBody:
 *      $ref: '#/components/requests/optionalScaleBody'
 *    responses:
 *      200:
 *        description: Scale that was updated.
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
 *      404:
 *        $ref: '#/components/responses/scaleNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
scales.patch('/:id',
  checkGRPC,
  (_: Request, res: Response<ResponseBody<Scale>, { data: Scale, schema: SchemaDefinition }>, next: NextFunction) => {
    res.locals.schema = {
      name: { type: String, required: false },
      steps: { type: Array, required: false, schema: { type: Number, required: true } },
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
  (req: Request, res: Response<ResponseBody<Scale>, { data: Scale }>) => {
    if (req.query?.no_data && req.query.no_data === 'true')
      res.sendStatus(204)
    else
      res.status(200).type('application/json').json({ success: true, data: res.locals.data })
  }
)

export default scales
