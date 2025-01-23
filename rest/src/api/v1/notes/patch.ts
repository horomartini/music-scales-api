import type { Request, Response, NextFunction } from 'express'
import type { GetNoteResponse } from 'proto/__generated__/note'
import type { ParamId } from 'utils/requests'
import type { ResponseBody } from 'utils/responses'

import { Router } from 'express'

import { checkGRPC } from 'middleware/request'

import { checkBody } from 'utils/requests'
import { checkGRPCErrors } from 'utils/responses'
import { createErrorData, ErrorData } from 'utils/errors'
import { SchemaDefinition } from 'utils/parser'

import grpc from 'proto/grpc'


type Note = Exclude<GetNoteResponse['note'], undefined>

const notes = Router()

/**
 * @swagger
 *  /notes/{id}:
 *  patch:
 *    operationId: patchNote
 *    tags: 
 *      - notes
 *    summary: Update note
 *    description: Update chosen fields in Note except for ID.
 *    parameters:
 *      - $ref: '#/components/parameters/noteId'
 *      - $ref: '#/components/parameters/noData'
 *    requestBody:
 *      $ref: '#/components/requests/optionalNoteBody'
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
 *      204:
 *        $ref: '#/components/responses/noData'
 *      404:
 *        $ref: '#/components/responses/noteNotFound'
 *      400:
 *        $ref: '#/components/responses/badRequest'
 */  
notes.patch('/:id',
  checkGRPC,
  (_: Request, res: Response<ResponseBody<Note>, { data: Note, schema: SchemaDefinition }>, next: NextFunction) => {
    res.locals.schema = {
      name: { type: String, required: false },
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
  (req: Request, res: Response<ResponseBody<Note>, { data: Note }>, next: NextFunction) => {
    if (req.query?.no_data && req.query.no_data === 'true')
      res.sendStatus(204)
    else
      res.status(200).type('application/json').json({ success: true, data: res.locals.data })
  }
)


export default notes
