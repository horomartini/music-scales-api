import type { Request, Response, NextFunction } from 'express'
import type { GetNoteResponse, GetNotesRequest, GetNotesResponse } from 'proto/__generated__/note'
import type { ParamId } from 'utils/requests'
import type { PaginationData, ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC, parsePagination } from 'middleware/request'
import { parseFilters, parseSorters, validateParamId } from 'middleware/request'

import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'

import grpc from 'proto/grpc'


type Note = Exclude<GetNoteResponse['note'], undefined>
type Notes = Exclude<GetNotesResponse['notes'], undefined>

const notes = Router()

notes.get('/',
  checkGRPC,
  parseFilters,
  parseSorters,
  parsePagination,
  async (_: Request, res: Response<ResponseBody<Notes>, { data: Notes, paginationData?: PaginationData, error?: ErrorData, ux?: GetNotesRequest }>, next: NextFunction) => {
    const request = grpc.Client.Note!.req.getMany(res.locals.ux)

    try {
      const response = await grpc.Client.Note!.getMany(request)
      res.locals.data = response.notes
      res.locals.paginationData = {
        totalCount: response.totalCount, 
        pagesCount: response.totalPages, 
        nextPage: response.nextPageToken, 
      }
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    if (res.locals?.data === undefined)
      res.locals.data = []

    next()
  },
  checkGRPCErrors, // TODO: does not quite work
  (_: Request, res: Response<ResponseBody<Notes>, { data: Notes, paginationData?: PaginationData, error?: ErrorData, ux?: GetNotesRequest }>, next: NextFunction) => {
    res.status(200).json({ 
      success: true, 
      data: res.locals.data, 
      ...(res.locals.ux?.pageToken ? { paginationData: res.locals.paginationData } : {}), 
    })
  }
)

notes.get('/:id',
  checkGRPC,
  validateParamId,
  async (req: Request<ParamId>, res: Response, next: NextFunction) => {
    const request = grpc.Client.Note!.req.get({ id: req.params.id })

    try {
      const response = await grpc.Client.Note!.get(request)
      res.locals.data = response.note
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    if (res.locals?.data === undefined)
      res.locals.data = null

    next()
  },
  (_: Request, res: Response<ResponseBody<Note | null>, { data: Note | null, error?: ErrorData }>, next: NextFunction) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)


export default notes
