import type { Request, Response, NextFunction } from 'express'
import type { GetTuningResponse } from 'proto/__generated__/tuning'
import type { ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC } from 'middleware/request'

import { checkBody, type ParamId } from 'utils/requests'
import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'
import { SchemaDefinition } from 'utils/parser'

import grpc from 'proto/grpc'


type Tuning = Exclude<GetTuningResponse['tuning'], undefined>

const tunings = Router()

/**
 * @swagger
 *  /tunings/{id}:
 *  put:
 *    operationId: putTuning
 *    tags: 
 *      - tunings
 *    summary: Overwrite tuning
 *    description: Replace all fields in Tuning with different ones except for ID.
 *    parameters:
 *      - $ref: '#/components/parameters/tuningId'
 *      - $ref: '#/components/parameters/noData'
 *    requestBody:
 *      $ref: '#/components/requests/tuningBody'
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
 *      204:
 *        $ref: '#/components/responses/noData'
 *      404:
 *        $ref: '#/components/responses/tuningNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
tunings.put('/:id',
  checkGRPC,
  (_: Request, res: Response<ResponseBody<Tuning>, { data: Tuning, schema: SchemaDefinition }>, next: NextFunction) => {
    res.locals.schema = {
      name: { type: String, required: true },
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
  (req: Request, res: Response<ResponseBody<Tuning>, { data: Tuning }>, next: NextFunction) => {
    if (req.query?.no_data && req.query.no_data === 'true')
      res.sendStatus(204)
    else
      res.status(200).type('application/json').json({ success: true, data: res.locals.data })
  }
)


export default tunings
