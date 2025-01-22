import type { Request, Response, NextFunction } from 'express'
import type { GetInstrumentResponse } from 'proto/__generated__/instrument'
import type { ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC } from 'middleware/request'

import { checkBody } from 'utils/requests'
import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'
import { SchemaDefinition } from 'utils/parser'

import grpc from 'proto/grpc'


type Instrument = Exclude<GetInstrumentResponse['instrument'], undefined>

const instruments = Router()


/**
 * @swagger
 *  /instruments/{id}:
 *  post:
 *    operationId: postInstrument
 *    tags: 
 *      - instruments
 *    summary: Add instrument
 *    description: Add instrument with specified body. ID is generated automatically.
 *    requestBody:
 *      $ref: '#/components/requests/instrumentBody'
 *    responses:
 *      200:
 *        description: Instrument that was created.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success: 
 *                  type: boolean
 *                data: 
 *                  $ref: '#/components/responses/instrumentData'
 *              required:
 *                - success
 *                - data
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
instruments.post('/', 
  checkGRPC,
  (_: Request, res: Response<ResponseBody<Instrument | null>, { data: Instrument | null, schema: SchemaDefinition }>, next: NextFunction) => {
    res.locals.schema = {
      name: { type: String, required: true },
      defaultTuningId: { type: String, required: false },
    }

    next()
  },
  checkBody,
  async (req: Request, res: Response<ResponseBody<Instrument | null>, { data: Instrument | null, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Instrument!.req.add(req.body)

    try {
      const response = await grpc.Client.Instrument!.add(request)
      res.locals.data = response.instrument ?? null
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    if (res.locals?.data === undefined)
      res.locals.data = null

    next()
  },
  checkGRPCErrors,
  (_: Request, res: Response<ResponseBody<Instrument | null>, { data: Instrument | null }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)


export default instruments
