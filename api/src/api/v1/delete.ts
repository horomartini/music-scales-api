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


router.delete(
  '/notes/:id',
  (req: Request<ParamId>, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.locals.data = { _id: stringToObjectId(id) } as Pick<NoteDoc, '_id'>
    res.locals.schema = {
      _id: { type: mongoose.Types.ObjectId, required: true },
    }
    next()
  },
  checkLocalsData<Pick<NoteDoc, '_id'>>,
  async (_: Request, res: Response<{}, { data: Pick<NoteDoc, '_id'> }>, next: NextFunction) => {
    await db.notes.deleteOne(res.locals.data)
    next()
  },
  (_: Request, res: Response) => {
    res.status(204).json({ success: true })
  }
)

router.delete(
  '/instruments/:id',
  (req: Request<ParamId>, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.locals.data = { _id: stringToObjectId(id) } as Pick<InstrumentDoc, '_id'>
    res.locals.schema = {
      _id: { type: mongoose.Types.ObjectId, required: true },
    }
    next()
  },
  checkLocalsData<Pick<InstrumentDoc, '_id'>>,
  async (_: Request, res: Response<{}, { data: Pick<InstrumentDoc, '_id'> }>, next: NextFunction) => {
    await db.instruments.deleteOne(res.locals.data)
    next()
  },
  (_: Request, res: Response) => {
    res.status(204).json({ success: true })
  }
)


export default router
