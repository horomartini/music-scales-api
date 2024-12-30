import type { Request, Response, NextFunction } from 'express'
import type { Instrument, Note, Scale, Tuning } from 'types/api'
import type { ObjectId } from 'types/db'

import express from 'express'

import { checkLocalsData } from '../../middleware/request'

import db from '../../db'
import mongoose from 'mongoose'


const router = express.Router()


router.post(
  '/notes',
  (req: Request<{}, {}, Note, {}>, res: Response, next: NextFunction) => {
    res.locals.data = req.body
    res.locals.schema = {
      name: { type: String, required: true },
    }
    next()
  },
  checkLocalsData<Note>,
  async (_: Request, res: Response<{}, { data: Note, dataId?: ObjectId | null }>, next: NextFunction) => {
    res.locals.dataId = await db.notes.postOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: Note, dataId?: ObjectId | null }>) => {
    if (req.query.with_content === 'true') 
      res.status(201).json({ success: true, data: await db.notes.getOne({ _id: res.locals.dataId ?? undefined }) })
    else
      res.sendStatus(204)
  }
)

router.post(
  '/instruments',
  (req: Request<{}, {}, Instrument, {}>, res: Response, next: NextFunction) => {
    res.locals.data = req.body
    res.locals.schema = {
      name: { type: String, required: true },
      defaultTuning: { type: mongoose.Types.ObjectId },
    }
    next()
  },
  checkLocalsData<Instrument>,
  async (_: Request, res: Response<{}, { data: Instrument, dataId?: ObjectId | null }>, next: NextFunction) => {
    res.locals.dataId = await db.instruments.postOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: Note, dataId?: ObjectId | null }>) => {
    if (req.query.with_content === 'true') 
      res.status(201).json({ success: true, data: await db.instruments.getOne({ _id: res.locals.dataId ?? undefined }) })
    else
      res.sendStatus(204)
  }
)

router.post(
  '/tunings',
  (req: Request<{}, {}, Tuning, {}>, res: Response, next: NextFunction) => {
    res.locals.data = req.body
    res.locals.schema = {
      name: { type: String, required: true },
      instrument: { type: mongoose.Types.ObjectId },
      notes: { type: Array, schema: {
        note: { type: mongoose.Types.ObjectId, required: true },
        octave: { type: Number, required: true },
      }},
    }
    next()
  },
  checkLocalsData<Tuning>,
  async (_: Request, res: Response<{}, { data: Tuning, dataId?: ObjectId | null }>, next: NextFunction) => {
    res.locals.dataId = await db.tunings.postOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: Note, dataId?: ObjectId | null }>) => {
    if (req.query.with_content === 'true') 
      res.status(201).json({ success: true, data: await db.tunings.getOne({ _id: res.locals.dataId ?? undefined }) })
    else
      res.sendStatus(204)
  }
)

router.post(
  '/scales',
  (req: Request<{}, {}, Scale, {}>, res: Response, next: NextFunction) => {
    res.locals.data = req.body
    res.locals.schema = {
      name: { type: String, required: true },
      steps: { type: Array, required: true, schema: { type: Number, required: true } }
    }
    next()
  },
  checkLocalsData<Scale>,
  async (_: Request, res: Response<{}, { data: Scale, dataId?: ObjectId | null }>, next: NextFunction) => {
    res.locals.dataId = await db.scales.postOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: Note, dataId?: ObjectId | null }>) => {
    if (req.query.with_content === 'true') 
      res.status(201).json({ success: true, data: await db.scales.getOne({ _id: res.locals.dataId ?? undefined }) })
    else
      res.sendStatus(204)
  }
)


export default router
