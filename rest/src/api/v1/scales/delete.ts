import type { Request, Response, NextFunction } from 'express'
import type { ResponseBody } from 'utils/responses'
import type { ParamId } from 'utils/requests'

import { Router } from 'express'

import { checkGRPC } from 'middleware/request'

import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'

import grpc from 'proto/grpc'


const scales = Router()

/**
 * @swagger
 *  /scales/{id}:
 *  delete:
 *    operationId: deleteScale
 *    tags: 
 *      - scales
 *    summary: Delete scale
 *    description: Delete scale with specified ID.
 *    parameters:
 *      - $ref: '#/components/parameters/scaleId'
 *      - $ref: '#/components/parameters/noData'
 *    responses:
 *      200:
 *        description: ID of scale that was deleted.
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
 *      204:
 *        $ref: '#/components/responses/noData'
 *      404:
 *        $ref: '#/components/responses/scaleNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
scales.delete('/:id',
  checkGRPC,
  async (req: Request<ParamId>, res: Response<ResponseBody<string>, { data: string, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Scale!.req.delete({ id: req.params.id })

    try {
      const response = await grpc.Client.Scale!.delete(request)
      res.locals.data = response.id
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    next()
  },
  checkGRPCErrors,
  (req: Request, res: Response<ResponseBody<string>, { data: string }>) => {
    if (req.query?.no_data && req.query.no_data === 'true')
      res.sendStatus(204)
    else
      res.status(200).type('application/json').json({ success: true, data: res.locals.data })
  }
)

export default scales
