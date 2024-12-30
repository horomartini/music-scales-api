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
  async (_: Request, res: Response<{}, { data: Partial<NoteDoc>, exists?: NoteDoc }>, next: NextFunction) => {
    const noteDb = await db.notes.getOne({ _id: res.locals.data._id })

    if (noteDb !== null)
      res.locals.exists = noteDb

    next()
  },
  checkIfExist,
  async (_: Request, res: Response<{}, { data: Partial<NoteDoc> }>, next: NextFunction) => {
    await db.notes.patchOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: Partial<NoteDoc> }>) => {
    if (req.query.with_content === 'true') 
      res.status(200).json({ success: true, data: await db.notes.getOne({ _id: res.locals.data._id }) })
    else
      res.sendStatus(204)
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
  async (_: Request, res: Response<{}, { data: Partial<InstrumentDoc>, exists?: InstrumentDoc }>, next: NextFunction) => {
    const noteDb = await db.instruments.getOne({ _id: res.locals.data._id })

    if (noteDb !== null)
      res.locals.exists = noteDb

    next()
  },
  checkIfExist,
  async (_: Request, res: Response<{}, { data: Partial<InstrumentDoc> }>, next: NextFunction) => {
    await db.instruments.patchOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: Partial<InstrumentDoc> }>) => {
    if (req.query.with_content === 'true') 
      res.status(200).json({ success: true, data: await db.instruments.getOne({ _id: res.locals.data._id }) })
    else
      res.sendStatus(204)
  }
)

router.patch(
  '/tunings/:id',
  (req: Request<ParamId, {}, Partial<Tuning>>, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.locals.data = { ...req.body, _id: stringToObjectId(id) }
    res.locals.schema = {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String },
      instrument: { type: mongoose.Types.ObjectId },
      notes: { type: Array, schema: {
        note: { type: mongoose.Types.ObjectId },
        octave: { type: Number },
      }},
    }
    next()
  },
  checkLocalsData<Partial<TuningDoc>>,
  async (_: Request, res: Response<{}, { data: Partial<TuningDoc>, exists?: TuningDoc }>, next: NextFunction) => {
    const noteDb = await db.tunings.getOne({ _id: res.locals.data._id })

    if (noteDb !== null)
      res.locals.exists = noteDb

    next()
  },
  checkIfExist,
  async (_: Request, res: Response<{}, { data: Partial<TuningDoc> }>, next: NextFunction) => {
    await db.tunings.patchOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: Partial<TuningDoc> }>) => {
    if (req.query.with_content === 'true') 
      res.status(200).json({ success: true, data: await db.tunings.getOne({ _id: res.locals.data._id }) })
    else
      res.sendStatus(204)
  }
)

router.patch(
  '/scales/:id',
  (req: Request<ParamId, {}, Partial<Scale>>, res: Response, next: NextFunction) => {
    const { id } = req.params
    res.locals.data = { ...req.body, _id: stringToObjectId(id) }
    res.locals.schema = {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String },
      steps: { type: Array, schema: { type: Number } }
    }
    next()
  },
  checkLocalsData<Partial<ScaleDoc>>,
  async (_: Request, res: Response<{}, { data: Partial<ScaleDoc>, exists?: ScaleDoc }>, next: NextFunction) => {
    const noteDb = await db.scales.getOne({ _id: res.locals.data._id })

    if (noteDb !== null)
      res.locals.exists = noteDb

    next()
  },
  checkIfExist,
  async (_: Request, res: Response<{}, { data: Partial<ScaleDoc> }>, next: NextFunction) => {
    await db.scales.patchOne(res.locals.data)
    next()
  },
  async (req: Request<{}, {}, {}, { with_content: string }>, res: Response<{}, { data: Partial<ScaleDoc> }>) => {
    if (req.query.with_content === 'true') 
      res.status(200).json({ success: true, data: await db.scales.getOne({ _id: res.locals.data._id }) })
    else
      res.sendStatus(204)
  }
)


export default router
