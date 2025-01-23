import type { Request, Response, NextFunction } from 'express'
import type { GetInstrumentResponse, GetInstrumentsRequest, GetInstrumentsResponse } from 'proto/__generated__/instrument'
import type { ParamId } from 'utils/requests'
import type { PaginationData, ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC, parsePagination } from 'middleware/request'
import { parseFilters, parseSorters, validateParamId } from 'middleware/request'

import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'

import grpc from 'proto/grpc'


type Instrument = Exclude<GetInstrumentResponse['instrument'], undefined>
type Instruments = Exclude<GetInstrumentsResponse['instruments'], undefined>

const Instruments = Router()

/**
 * @swagger
 *  /instruments:
 *  get:
 *    operationId: getInstruments
 *    tags: 
 *      - instruments
 *    summary: Get all instruments
 *    description: Fetch a list of all instruments.
 *    parameters:
 *      - $ref: '#/components/parameters/filter/name_ne'
 *      - $ref: '#/components/parameters/filter/name_eq'
 *      - $ref: '#/components/parameters/sort/name'
 *      - $ref: '#/components/parameters/paginate/page'
 *      - $ref: '#/components/parameters/paginate/limit'
 *      - $ref: '#/components/parameters/noData'
 *    responses:
 *      200:
 *        description: A list of instruments.
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
 *                    $ref: '#/components/responses/instrumentData'
 *                paginationData:
 *                  $ref: '#/components/responses/paginationData'
 *              required:
 *                - success
 *                - data
 *      204:
 *        $ref: '#/components/responses/noData'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */                     
Instruments.get('/',
  checkGRPC,
  parseFilters,
  parseSorters,
  parsePagination,
  async (_: Request, res: Response<ResponseBody<Instruments>, { data: Instruments, paginationData?: PaginationData, error?: ErrorData, ux?: GetInstrumentsRequest }>, next: NextFunction) => {
    const request = grpc.Client.Instrument!.req.getMany(res.locals.ux)

    try {
      const response = await grpc.Client.Instrument!.getMany(request)
      res.locals.data = response.instruments
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
  (req: Request, res: Response<ResponseBody<Instruments>, { data: Instruments, paginationData?: PaginationData, ux?: GetInstrumentsRequest }>) => {
    if (req.query?.no_data && req.query.no_data === 'true')
      res.sendStatus(204)
    else
      res.status(200).type('application/json').json({ 
        success: true, 
        data: res.locals.data, 
        ...(res.locals.ux?.pageToken ? { paginationData: res.locals.paginationData } : {}), 
      })
  }
)

/**
 * @swagger
 *  /instruments/{id}:
 *  get:
 *    operationId: getInstrument
 *    tags: 
 *      - instruments
 *    summary: Get instrument
 *    description: Fetch an instrument based on given ID.
 *    parameters:
 *      - $ref: '#/components/parameters/instrumentId'
 *      - $ref: '#/components/parameters/noData'
 *    responses:
 *      200:
 *        description: Instrument document.
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
 *      204:
 *        $ref: '#/components/responses/noData'
 *      404:
 *        $ref: '#/components/responses/instrumentNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
Instruments.get('/:id',
  checkGRPC,
  validateParamId,
  async (req: Request<ParamId>, res: Response<ResponseBody<Instrument | null>, { data: Instrument | null, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Instrument!.req.get({ id: req.params.id })

    try {
      const response = await grpc.Client.Instrument!.get(request)
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
  (req: Request, res: Response<ResponseBody<Instrument | null>, { data: Instrument | null }>) => {
    if (req.query?.no_data && req.query.no_data === 'true')
      res.sendStatus(204)
    else
      res.status(200).type('application/json').json({ success: true, data: res.locals.data })
  }
)


export default Instruments
