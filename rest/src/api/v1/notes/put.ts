import type { Request, Response, NextFunction } from 'express'
import type { GetNoteResponse, GetNotesRequest, GetNotesResponse } from 'proto/__generated__/note'
import { checkBody, type ParamId } from 'utils/requests'
import type { PaginationData, ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC, parsePagination } from 'middleware/request'
import { parseFilters, parseSorters, validateParamId } from 'middleware/request'

import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'

import grpc from 'proto/grpc'
import { SchemaDefinition } from 'utils/parser'


type Note = Exclude<GetNoteResponse['note'], undefined>

const notes = Router()

/**
 * @swagger
 * /notes/{id}:
 *  put:
 *    operationId: putNote
 *    tags: 
 *      - notes
 *    summary: Overwrite note
 *    description: Replace all fields in Note with different ones except for ID.
 *    requestBody:
 *      description: Note schema without ID.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *            required:
 *              - name
 *    responses:
 *      200:
 *        description: Note that was updated.
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
 *      404:
 *        $ref: '#/components/responses/noteNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
notes.put('/:id',
  checkGRPC,
  (_: Request, res: Response<ResponseBody<Note>, { data: Note, schema: SchemaDefinition }>, next: NextFunction) => {
    res.locals.schema = {
      name: { type: String, required: true },
    }

    next()
  },
  checkBody,
  async (req: Request<ParamId>, res: Response<ResponseBody<Note>, { data: Note, error?: ErrorData }>, next: NextFunction) => {
    const request = grpc.Client.Note!.req.update({ ...req.body, id: req.params.id })

    try {
      const response = await grpc.Client.Note!.update(request)
      res.locals.data = response.note!
    } 
    catch (error) {
      res.locals.error = createErrorData(error)
    }

    next()
  },
  checkGRPCErrors,
  (_: Request, res: Response<ResponseBody<Note>, { data: Note }>, next: NextFunction) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)


export default notes
