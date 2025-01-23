import type { Request, Response, NextFunction } from 'express'
import type { GetTuningResponse } from 'proto/__generated__/tuning'
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
 *  post:
 *    operationId: postTuning
 *    tags: 
 *      - tunings
 *    summary: Add tuning
 *    description: Add tuning with specified body. ID is generated automatically.
 *    parameters:
 *      - $ref: '#/components/parameters/noData'
 *    requestBody:
 *      $ref: '#/components/requests/tuningBody'
 *    responses:
 *      201:
 *        description: Tuning that was created.
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
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
tunings.post('/', 
  checkGRPC,
  (_: Request, res: Response<ResponseBody<Tuning | null>, { data: Tuning | null, schema: SchemaDefinition }>, next: NextFunction) => {
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
  async (req: Request, res: Response<ResponseBody<Tuning | null>, { data: Tuning | null, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Tuning!.req.add(req.body)

    try {
      const response = await grpc.Client.Tuning!.add(request)
      res.locals.data = response.tuning ?? null
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    if (res.locals?.data === undefined)
      res.locals.data = null

    next()
  },
  checkGRPCErrors,
  (req: Request, res: Response<ResponseBody<Tuning | null>, { data: Tuning | null }>) => {
    if (req.query?.no_data && req.query.no_data === 'true')
      res.sendStatus(204)
    else
      res.status(201).type('application/json').json({ success: true, data: res.locals.data })
  }
)


export default tunings
