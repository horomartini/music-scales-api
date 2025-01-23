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

/**
 * @swagger
 *  /notes:
 *  get:
 *    operationId: getNotes
 *    tags: 
 *      - notes
 *    summary: Get all notes
 *    description: Fetch a list of all notes.
 *    parameters:
 *      - $ref: '#/components/parameters/filter/name_ne'
 *      - $ref: '#/components/parameters/filter/name_eq'
 *      - $ref: '#/components/parameters/sort/name'
 *      - $ref: '#/components/parameters/paginate/page'
 *      - $ref: '#/components/parameters/paginate/limit'
 *      - $ref: '#/components/parameters/noData'
 *    responses:
 *      200:
 *        description: A list of notes.
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
 *                    $ref: '#/components/responses/noteData'
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
  (req: Request, res: Response<ResponseBody<Notes>, { data: Notes, paginationData?: PaginationData, ux?: GetNotesRequest }>) => {
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
 *  /notes/{id}:
 *  get:
 *    operationId: getNote
 *    tags: 
 *      - notes
 *    summary: Get note
 *    description: Fetch a note based on given ID.
 *    parameters:
 *      - $ref: '#/components/parameters/noteId'
 *      - $ref: '#/components/parameters/noData'
 *    responses:
 *      200:
 *        description: Note document.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success: 
 *                  type: boolean
 *                data: 
 *                  $ref: '#/components/responses/noteData'
 *              required:
 *                - success
 *                - data
 *      204:
 *        $ref: '#/components/responses/noData'
 *      404:
 *        $ref: '#/components/responses/noteNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
notes.get('/:id',
  checkGRPC,
  validateParamId,
  async (req: Request<ParamId>, res: Response<ResponseBody<Note | null>, { data: Note | null, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Note!.req.get({ id: req.params.id })

    try {
      const response = await grpc.Client.Note!.get(request)
      res.locals.data = response.note ?? null
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    if (res.locals?.data === undefined)
      res.locals.data = null

    next()
  },
  checkGRPCErrors,
  (req: Request, res: Response<ResponseBody<Note | null>, { data: Note | null }>) => {
    if (req.query?.no_data && req.query.no_data === 'true')
      res.sendStatus(204)
    else
      res.status(200).type('application/json').json({ success: true, data: res.locals.data })
  }
)


export default notes
