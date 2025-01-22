import type { Request, Response, NextFunction } from 'express'
import type { GetTuningResponse, GetTuningsRequest, GetTuningsResponse } from 'proto/__generated__/tuning'
import type { ParamId } from 'utils/requests'
import type { PaginationData, ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC, parsePagination } from 'middleware/request'
import { parseFilters, parseSorters, validateParamId } from 'middleware/request'

import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'

import grpc from 'proto/grpc'


type Tuning = Exclude<GetTuningResponse['tuning'], undefined>
type Tunings = Exclude<GetTuningsResponse['tunings'], undefined>

const tunings = Router()

/**
 * @swagger
 *  /tunings:
 *  get:
 *    operationId: getTunings
 *    tags: 
 *      - tunings
 *    summary: Get all tunings
 *    description: Fetch a list of all tunings.
 *    parameters:
 *      - $ref: '#/components/parameters/filter/name_ne'
 *      - $ref: '#/components/parameters/filter/name_eq'
 *      - $ref: '#/components/parameters/sort/name'
 *      - $ref: '#/components/parameters/paginate/page'
 *      - $ref: '#/components/parameters/paginate/limit'
 *    responses:
 *      200:
 *        description: A list of tunings.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success: 
 *                  type: boolean
 *                  default: true
 *                data: 
 *                  type: array
 *                  items:
 *                    $ref: '#/components/responses/tuningData'
 *                paginationData:
 *                  $ref: '#/components/responses/paginationData'
 *              required:
 *                - success
 *                - data
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */                     
tunings.get('/',
  checkGRPC,
  parseFilters,
  parseSorters,
  parsePagination,
  async (_: Request, res: Response<ResponseBody<Tunings>, { data: Tunings, paginationData?: PaginationData, error?: ErrorData, ux?: GetTuningsRequest }>, next: NextFunction) => {
    const request = grpc.Client.Tuning!.req.getMany(res.locals.ux)

    try {
      const response = await grpc.Client.Tuning!.getMany(request)
      res.locals.data = response.tunings
      res.locals.paginationData = {
        totalCount: response.totalCount, 
        pagesCount: response.totalPages, 
        nextPage: Number(response.nextPageToken.split(' ')?.[1] || -1), 
      }
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    if (res.locals?.data === undefined)
      res.locals.data = []

    next()
  },
  checkGRPCErrors,
  (_: Request, res: Response<ResponseBody<Tunings>, { data: Tunings, paginationData?: PaginationData, ux?: GetTuningsRequest }>) => {
    res.status(200).json({ 
      success: true, 
      data: res.locals.data, 
      ...(res.locals.ux?.pageToken ? { paginationData: res.locals.paginationData } : {}), 
    })
  }
)

/**
 * @swagger
 *  /tunings/{id}:
 *  get:
 *    operationId: getTuning
 *    tags: 
 *      - tunings
 *    summary: Get tuning
 *    description: Fetch a tuning based on given ID.
 *    parameters:
 *      - $ref: '#/components/parameters/tuningId'
 *    responses:
 *      200:
 *        description: Tuning document.
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
tunings.get('/:id',
  checkGRPC,
  validateParamId,
  async (req: Request<ParamId>, res: Response<ResponseBody<Tuning | null>, { data: Tuning | null, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Tuning!.req.get({ id: req.params.id })

    try {
      const response = await grpc.Client.Tuning!.get(request)
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
  (_: Request, res: Response<ResponseBody<Tuning | null>, { data: Tuning | null }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)


export default tunings
