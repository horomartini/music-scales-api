import type { Request, Response, NextFunction } from 'express'
import type { Instrument, Note } from 'types/api'
import type { BodyInstrumentOrMany } from 'types/req'

import express from 'express'

import { checkBody } from '../../middleware/request'

import db from '../../db/crud'
import { InstrumentDoc } from 'types/db'



const router = express.Router()


router.post(
  '/notes',
  (req: Request<{}, {}, Note | Note[], {}>, res: Response, next: NextFunction) => {
    res.locals.data = req.body
    res.locals.schema = {
      name: { type: String, required: true },
    }
    next()
  },
  checkBody<Note>, // TODO: here collection (no Doc)!
  async (_: Request, res: Response<{}, { data: Note | Note[] }>, next: NextFunction) => {
    const data = res.locals.data
    Array.isArray(data)
      ? await db.postNotes(data)
      : await db.postNote(data)
    next()
  },
  (_: Request, res: Response) => {
    res.status(201).json({ success: true })
  }
)

router.post(
  '/instruments',
  (req: Request<{}, {}, BodyInstrumentOrMany, {}>, res: Response, next: NextFunction) => {
    res.locals.data = req.body
    res.locals.schema = {
      name: { type: String, required: true },
      defaultTuning: { type: String },
    }
    next()
  },
  checkBody<InstrumentDoc>, // TODO: here collectionDoc!
  async (_: Request, res: Response<{}, { data: InstrumentDoc | InstrumentDoc[] }>, next: NextFunction) => {
    let data = res.locals.data
    Array.isArray(data) // TODO: if defaultTuning was not given, it is completely ommited in insertion to db
      ? await db.postInstruments(data)
      : await db.postInstrument(data)
    next()
  },
  (_: Request, res: Response) => {
    res.status(201).json({ success: true })
  }
)


export default router
