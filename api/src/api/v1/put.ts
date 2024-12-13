import type { Request, Response, NextFunction } from 'express'
import type { Instrument, Note } from 'types/api'
import type { BodyInstrumentOrMany, ParamNote } from 'types/req'

import express from 'express'

import { checkBody } from '../../middleware/request'

import db from '../../db/crud'
import { InstrumentDoc, NoteDoc, ObjectId } from 'types/db'


const router = express.Router()


router.put(
  '/notes/:note',
  (req: Request<ParamNote, {}, Note | Note[]>, res: Response, next: NextFunction) => {
    const { note: noteId } = req.params
    res.locals.objectId = noteId
    res.locals.cokolwiek = null
    res.locals.data = req.body
    res.locals.schema = {
      name: { type: String, required: true },
    }
    next()
  },
  checkBody<Note | Note[], { objectId: string }>,
  async (_: Request, res: Response<{}, { data: Note | Note[], objectId: string, cokolwiek: any }>, next: NextFunction) => {
    const objectId = res.locals.objectId
    const cc = res.locals.cokolwiek
    const data = res.locals.data
    const noteDb = await db.putNote({...data, _id: objectId })
    res.locals.data = noteDb
    next()
  },
)


export default router
