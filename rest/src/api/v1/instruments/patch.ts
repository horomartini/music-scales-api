import type { Request, Response, NextFunction } from 'express'
import type { GetInstrumentResponse } from 'proto/__generated__/instrument'
import type { ParamId } from 'utils/requests'
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
 *  patch:
 *    operationId: patchInstrument
 *    tags: 
 *      - instruments
 *    summary: Update instrument
 *    description: Update chosen fields in Instrument except for ID.
 *    parameters:
 *      - $ref: '#/components/parameters/instrumentId'
 *    requestBody:
 *      $ref: '#/components/requests/optionalInstrumentBody'
 *    responses:
 *      200:
 *        description: Instrument that was updated.
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
 *      404:
 *        $ref: '#/components/responses/instrumentNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
instruments.patch('/:id',
  checkGRPC,
  (_: Request, res: Response<ResponseBody<Instrument>, { data: Instrument, schema: SchemaDefinition }>, next: NextFunction) => {
    res.locals.schema = {
      name: { type: String, required: false },
      defaultTuningId: { type: String, required: false },
    }

    next()
  },
  checkBody,
  async (req: Request<ParamId>, res: Response<ResponseBody<Instrument>, { data: Instrument, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Instrument!.req.update({ ...req.body, id: req.params.id })

    try {
      const response = await grpc.Client.Instrument!.update(request)
      res.locals.data = response.instrument!
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    next()
  },
  checkGRPCErrors,
  (_: Request, res: Response<ResponseBody<Instrument>, { data: Instrument }>, next: NextFunction) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)


export default instruments
