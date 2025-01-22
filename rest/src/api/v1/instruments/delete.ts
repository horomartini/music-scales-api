import type { Request, Response, NextFunction } from 'express'
import type { ParamId } from 'utils/requests'
import type { ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC } from 'middleware/request'

import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'

import grpc from 'proto/grpc'

const instruments = Router()

/**
 * @swagger
 *  /instruments/{id}:
 *  delete:
 *    operationId: deleteInstrument
 *    tags: 
 *      - instruments
 *    summary: Delete instrument
 *    description: Delete instrument with specified ID.
 *    parameters:
 *      - $ref: '#/components/parameters/instrumentId'
 *    responses:
 *      200:
 *        description: ID of instrument that was deleted.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success: 
 *                  type: boolean
 *                data: 
 *                  type: string
 *              required:
 *                - success
 *                - data
 *      404:
 *        $ref: '#/components/responses/instrumentNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
instruments.delete('/:id',
  checkGRPC,
  async (req: Request<ParamId>, res: Response<ResponseBody<string>, { data: string, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Instrument!.req.delete({ id: req.params.id })

    try {
      const response = await grpc.Client.Instrument!.delete(request)
      res.locals.data = response.id
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    next()
  },
  checkGRPCErrors,
  (_: Request, res: Response<ResponseBody<string>, { data: string }>, next: NextFunction) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)


export default instruments
