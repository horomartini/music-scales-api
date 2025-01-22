import type { Request, Response, NextFunction } from 'express'
import type { GetTuningResponse } from 'proto/__generated__/tuning'
import type { ParamId } from 'utils/requests'
import type { ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC } from 'middleware/request'

import { checkBody } from 'utils/requests'
import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'
import { SchemaDefinition } from 'utils/parser'

import grpc from 'proto/grpc'


type Tuning = Exclude<GetTuningResponse['tuning'], undefined>

const tunings = Router()

/**
 * @swagger
 *  /tunings/{id}:
 *  patch:
 *    operationId: patchTuning
 *    tags: 
 *      - tunings
 *    summary: Update tuning
 *    description: Update chosen fields in Tuning except for ID.
 *    parameters:
 *      - $ref: '#/components/parameters/tuningId'
 *    requestBody:
 *      $ref: '#/components/requests/optionalTuningBody'
 *    responses:
 *      200:
 *        description: Tuning that was updated.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success: 
 *                  type: boolean
 *                data: 
 *                  $ref: '#/components/responses/tuningData'
 *              required:
 *                - success
 *                - data
 *      404:
 *        $ref: '#/components/responses/tuningNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
tunings.patch('/:id',
  checkGRPC,
  (_: Request, res: Response<ResponseBody<Tuning>, { data: Tuning, schema: SchemaDefinition }>, next: NextFunction) => {
    res.locals.schema = {
      name: { type: String, required: false },
      instrumentId: { type: String, required: false },
      notes: { type: Array, required: false, schema: {
        noteId: { type: String, required: true },
        octave: { type: Number, required: true },
      }},
    }

    next()
  },
  checkBody,
  async (req: Request<ParamId>, res: Response<ResponseBody<Tuning>, { data: Tuning, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Tuning!.req.update({ ...req.body, id: req.params.id })

    try {
      const response = await grpc.Client.Tuning!.update(request)
      res.locals.data = response.tuning!
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    next()
  },
  checkGRPCErrors,
  (_: Request, res: Response<ResponseBody<Tuning>, { data: Tuning }>, next: NextFunction) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)


export default tunings
