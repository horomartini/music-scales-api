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
