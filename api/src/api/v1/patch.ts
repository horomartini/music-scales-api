import type { Request, Response, NextFunction } from 'express'
import type { Instrument, Note } from 'types/api'
import type { InstrumentDoc, NoteDoc } from 'types/db'
import type { ParamId } from 'types/req'

import express from 'express'
import mongoose from 'mongoose'

import { checkLocalsData } from '../../middleware/request'

import db from '../../db'

import { stringToObjectId } from '../../utils/types'


const router = express.Router()


router.patch(
  '/notes/:id',
  (req: Request<ParamId, {}, Partial<Note>>, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.locals.data = { ...req.body, _id: stringToObjectId(id) }
    res.locals.schema = {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String },
    }
    next()
  },
  checkLocalsData<Partial<NoteDoc>>,
  async (_: Request, res: Response<{}, { data: Partial<NoteDoc> }>, next: NextFunction) => {
    await db.notes.patchOne(res.locals.data)
    next()
  },
  (_: Request, res: Response) => {
    res.status(204).json({ success: true })
  }
)

router.patch(
  '/instruments/:id',
  (req: Request<ParamId, {}, Partial<Instrument>>, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.locals.data = { ...req.body, _id: stringToObjectId(id) }
    res.locals.schema = {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String },
      defaultTuning: { type: mongoose.Types.ObjectId },
    }
    next()
  },
  checkLocalsData<Partial<InstrumentDoc>>,
  async (_: Request, res: Response<{}, { data: Partial<InstrumentDoc> }>, next: NextFunction) => {
    await db.instruments.patchOne(res.locals.data)
    next()
  },
  (_: Request, res: Response) => {
    res.status(204).json({ success: true })
  }
)


export default router
