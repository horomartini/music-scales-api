import type { Request, Response, NextFunction } from 'express'
import type { GetScaleResponse, GetScalesRequest, GetScalesResponse } from 'proto/__generated__/scale'
import type { ParamId } from 'utils/requests'
import type { PaginationData, ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC, parsePagination } from 'middleware/request'
import { parseFilters, parseSorters, validateParamId } from 'middleware/request'

import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'

import grpc from 'proto/grpc'


type Scale = Exclude<GetScaleResponse['scale'], undefined>
type Scales = Exclude<GetScalesResponse['scales'], undefined>

const scales = Router()

/**
 * @swagger
 *  /scales:
 *  get:
 *    operationId: getScales
 *    tags: 
 *      - scales
 *    summary: Get all scales
 *    description: Fetch a list of all scales.
 *    parameters:
 *      - $ref: '#/components/parameters/filter/name_ne'
 *      - $ref: '#/components/parameters/filter/name_eq'
 *      - $ref: '#/components/parameters/sort/name'
 *      - $ref: '#/components/parameters/paginate/page'
 *      - $ref: '#/components/parameters/paginate/limit'
 *    responses:
 *      200:
 *        description: A list of scales.
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
 *                    $ref: '#/components/responses/scaleData'
 *                paginationData:
 *                  $ref: '#/components/responses/paginationData'
 *              required:
 *                - success
 *                - data
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */   
scales.get('/',
  checkGRPC,
  parseFilters,
  parseSorters,
  parsePagination,
  async (_: Request, res: Response<ResponseBody<Scales>, { data: Scales, paginationData?: PaginationData, error?: ErrorData, ux?: GetScalesRequest }>, next: NextFunction) => {
    const request = grpc.Client.Scale!.req.getMany(res.locals.ux)

    try {
      const response = await grpc.Client.Scale!.getMany(request)
      res.locals.data = response.scales
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
  (_: Request, res: Response<ResponseBody<Scales>, { data: Scales, paginationData?: PaginationData, ux?: GetScalesRequest }>) => {
    res.status(200).json({ 
      success: true, 
      data: res.locals.data, 
      ...(res.locals.ux?.pageToken ? { paginationData: res.locals.paginationData } : {}), 
    })
  }
)

/**
 * @swagger
 *  /scales/{id}:
 *  get:
 *    operationId: getScale
 *    tags: 
 *      - scales
 *    summary: Get scale
 *    description: Fetch a scale based on given ID.
 *    parameters:
 *      - $ref: '#/components/parameters/scaleId'
 *    responses:
 *      200:
 *        description: Scale document.
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
 *      404:
 *        $ref: '#/components/responses/scaleNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
scales.get('/:id',
  checkGRPC,
  validateParamId,
  async (req: Request<ParamId>, res: Response<ResponseBody<Scale | null>, { data: Scale | null, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Scale!.req.get({ id: req.params.id })

    try {
      const response = await grpc.Client.Scale!.get(request)
      res.locals.data = response.scale ?? null
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    if (res.locals?.data === undefined)
      res.locals.data = null

    next()
  },
  checkGRPCErrors,
  (_: Request, res: Response<ResponseBody<Scale | null>, { data: Scale | null }>,) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)

export default scales
