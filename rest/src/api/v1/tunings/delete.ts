import type { Request, Response, NextFunction } from 'express'
import type { ParamId } from 'utils/requests'
import type { ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC } from 'middleware/request'

import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'

import grpc from 'proto/grpc'

const tunings = Router()

/**
 * @swagger
 *  /tunings/{id}:
 *  delete:
 *    operationId: deleteTuning
 *    tags: 
 *      - tunings
 *    summary: Delete tuning
 *    description: Delete tuning with specified ID.
 *    parameters:
 *      - $ref: '#/components/parameters/tuningId'
 *      - $ref: '#/components/parameters/noData'
 *    responses:
 *      200:
 *        description: ID of tuning that was deleted.
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
 *        $ref: '#/components/responses/tuningNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
tunings.delete('/:id',
  checkGRPC,
  async (req: Request<ParamId>, res: Response<ResponseBody<string>, { data: string, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Tuning!.req.delete({ id: req.params.id })

    try {
      const response = await grpc.Client.Tuning!.delete(request)
      res.locals.data = response.id
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    next()
  },
  checkGRPCErrors,
  (req: Request, res: Response<ResponseBody<string>, { data: string }>, next: NextFunction) => {
    if (req.query?.no_data && req.query.no_data === 'true')
      res.sendStatus(204)
    else
      res.status(200).type('application/json').json({ success: true, data: res.locals.data })
  }
)


export default tunings
