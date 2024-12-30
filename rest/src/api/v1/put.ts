import type { Request, Response, NextFunction } from 'express'
import type { Instrument, Note, Scale, Tuning } from 'types/api'
import type { InstrumentDoc, NoteDoc, ScaleDoc, TuningDoc } from 'types/db'
import type { ParamId } from 'types/req'

import express from 'express'
import mongoose from 'mongoose'

import { checkIfExist, checkLocalsData } from '../../middleware/request'

import db from '../../db'

import { stringToObjectId } from '../../utils/types'


const router = express.Router()


router.put(
  '/notes/:id',
  (req: Request<ParamId, {}, Note>, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.locals.data = { ...req.body, _id: stringToObjectId(id) }
    res.locals.schema = {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
    }
    next()
  },
  checkLocalsData<NoteDoc>,
  async (_: Request, res: Response<{}, { data: NoteDoc, exists?: NoteDoc }>, next: NextFunction) => {
    const noteDb = await db.notes.getOne({ _id: res.locals.data._id })

    if (noteDb !== null)
      res.locals.exists = noteDb

    next()
  },
  checkIfExist,
  async (_: Request, res: Response<{}, { data: NoteDoc }>, next: NextFunction) => {
    await db.notes.putOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: NoteDoc }>) => {
    if (req.query.with_content === 'true') 
      res.status(200).json({ success: true, data: await db.notes.getOne({ _id: res.locals.data._id }) })
    else
      res.sendStatus(204)
  }
)

router.put(
  '/instruments/:id',
  (req: Request<ParamId, {}, Instrument>, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.locals.data = { ...req.body, _id: stringToObjectId(id) }
    res.locals.schema = {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
      defaultTuning: { type: mongoose.Types.ObjectId }
    }
    next()
  },
  checkLocalsData<InstrumentDoc>,
  async (_: Request, res: Response<{}, { data: InstrumentDoc, exists?: InstrumentDoc }>, next: NextFunction) => {
    const noteDb = await db.instruments.getOne({ _id: res.locals.data._id })

    if (noteDb !== null)
      res.locals.exists = noteDb

    next()
  },
  checkIfExist,
  async (_: Request, res: Response<{}, { data: InstrumentDoc }>, next: NextFunction) => {
    await db.instruments.putOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: InstrumentDoc }>) => {
    if (req.query.with_content === 'true') 
      res.status(200).json({ success: true, data: await db.instruments.getOne({ _id: res.locals.data._id }) })
    else
      res.sendStatus(204)
  }
)

router.put(
  '/tunings/:id',
  (req: Request<ParamId, {}, Tuning>, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.locals.data = { ...req.body, _id: stringToObjectId(id) }
    res.locals.schema = {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
      instrument: { type: mongoose.Types.ObjectId },
      notes: { type: Array, schema: {
        note: { type: mongoose.Types.ObjectId, required: true },
        octave: { type: Number, required: true },
      }},
    }
    next()
  },
  checkLocalsData<TuningDoc>,
  async (_: Request, res: Response<{}, { data: TuningDoc, exists?: TuningDoc }>, next: NextFunction) => {
    const noteDb = await db.tunings.getOne({ _id: res.locals.data._id })

    if (noteDb !== null)
      res.locals.exists = noteDb

    next()
  },
  checkIfExist,
  async (_: Request, res: Response<{}, { data: TuningDoc }>, next: NextFunction) => {
    await db.tunings.putOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: TuningDoc }>) => {
    if (req.query.with_content === 'true') 
      res.status(200).json({ success: true, data: await db.tunings.getOne({ _id: res.locals.data._id }) })
    else
      res.sendStatus(204)
  }
)

router.put(
  '/scales/:id',
  (req: Request<ParamId, {}, Scale>, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.locals.data = { ...req.body, _id: stringToObjectId(id) }
    res.locals.schema = {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
      steps: { type: Array, required: true, schema: { type: Number, required: true } }
    }
    next()
  },
  checkLocalsData<ScaleDoc>,
  async (_: Request, res: Response<{}, { data: ScaleDoc, exists?: ScaleDoc }>, next: NextFunction) => {
    const noteDb = await db.scales.getOne({ _id: res.locals.data._id })

    if (noteDb !== null)
      res.locals.exists = noteDb

    next()
  },
  checkIfExist,
  async (_: Request, res: Response<{}, { data: ScaleDoc }>, next: NextFunction) => {
    await db.scales.putOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: ScaleDoc }>) => {
    if (req.query.with_content === 'true') 
      res.status(200).json({ success: true, data: await db.scales.getOne({ _id: res.locals.data._id }) })
    else
      res.sendStatus(204)
  }
)


export default router
