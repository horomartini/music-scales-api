import type { NextFunction, Request, Response } from 'express'
import type { ParamId, QueryUnknown } from 'types/req'
import type { ResponseBody } from 'types/res'
import type { InstrumentDoc, NoteDoc, ScaleDoc, TuningDoc } from 'types/db'

import express from 'express'

import { applyFiltering, applyHateoas, applyPagination, applySorting, responseVerbosity } from '../../middleware/response'
import { checkIfFound } from '../../middleware/request'

import db from '../../db'

import { stringToObjectId } from '../../utils/types'


const router = express.Router()

router.get(
  '/healthcheck', 
  (_: Request, res: Response) => {
    res
      .status(200)
      .json({ success: true, message: 'success' })
  }
)

router.get(
  '/notes', 
  async (_: Request, res: Response, next: NextFunction) => {
    const notesDb = await db.notes.getMany()
    res.locals.data = notesDb
    next()
  }, 
  applyFiltering,
  applySorting,
  applyPagination,
  // (req: Request<{}, {}, {}, QueryUnknown & { hateoas?: string }>, res: Response, next: NextFunction) => { // TODO: hateoas to do
  //   if (req.query?.hateoas === 'true') {
  //     res.locals.links = [
  //       { href: '', rel: '', type: '' }
  //     ]
  //   }
  //   next()
  // },
  (_: Request, res: Response<{}, { data: NoteDoc[] }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)

router.get(
  '/notes/:id',
  (req: Request<ParamId>, res: Response, next: NextFunction) => {
    const { id: noteId } = req.params
    if (noteId)
      res.locals.query = { _id: stringToObjectId(noteId) } as Partial<NoteDoc>
    next()
  },
  async (_: Request, res: Response<{}, { query?: Partial<NoteDoc>, data: NoteDoc | null }>, next: NextFunction) => {
    const noteDb = await db.notes.getOne(res.locals.query ?? {})
    res.locals.data = noteDb
    next()
  },
  checkIfFound,
  (_: Request, res: Response<{}, { data: NoteDoc | null }>) => {
    if (res.locals.data === null)
      res.status(404).json({ success: false })
    else
      res.status(200).json({ success: true, data: res.locals.data })
  }
)

router.get(
  '/instruments',
  async (_: Request, res: Response, next: NextFunction) => {
    const instrumentsDb = await db.instruments.getMany()
    res.locals.data = instrumentsDb
    next()
  },
  applyFiltering,
  applySorting,
  applyPagination,
  (_: Request, res: Response<{}, { data: InstrumentDoc[] }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)

router.get(
  '/instruments/:id',
  (req: Request<ParamId>, res: Response, next: NextFunction) => {
    const { id: instrumentId } = req.params
    if (instrumentId)
      res.locals.query = { _id: stringToObjectId(instrumentId) } as Partial<InstrumentDoc>
    next()
  },
  async (_: Request, res: Response<{}, { query?: Partial<InstrumentDoc>, data: InstrumentDoc | null }>, next: NextFunction) => {
    const instrumentDb = await db.instruments.getOne(res.locals.query ?? {})
    res.locals.data = instrumentDb
    next()
  },
  checkIfFound,
  (_: Request, res: Response<{}, { data: InstrumentDoc | null }>) => {
    if (res.locals.data === null)
      res.status(404).json({ success: false })
    else
      res.status(200).json({ success: true, data: res.locals.data })
  }
)

router.get(
  '/tunings',
  async (_: Request, res: Response, next: NextFunction) => {
    const tuningsDb = await db.tunings.getMany()
    res.locals.data = tuningsDb
    next()
  },
  applyFiltering,
  applySorting,
  applyPagination,
  (_: Request, res: Response<{}, { data: TuningDoc[] }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)

router.get(
  '/tunings/:id',
  (req: Request<ParamId>, res: Response, next: NextFunction) => {
    const { id: tuningId } = req.params
    if (tuningId)
      res.locals.query = { _id: stringToObjectId(tuningId) } as Partial<TuningDoc>
    next()
  },
  async (_: Request, res: Response<{}, { query?: Partial<TuningDoc>, data: TuningDoc | null }>, next: NextFunction) => {
    const tuningDb = await db.tunings.getOne(res.locals.query ?? {})
    res.locals.data = tuningDb
    next()
  },
  checkIfFound,
  (_: Request, res: Response<{}, { data: TuningDoc | null }>) => {
    if (res.locals.data === null)
      res.status(404).json({ success: false })
    else
      res.status(200).json({ success: true, data: res.locals.data })
  }
)

router.get(
  '/scales',
  async (_: Request, res: Response, next: NextFunction) => {
    const scalesDb = await db.scales.getMany()
    res.locals.data = scalesDb
    next()
  },
  applyFiltering,
  applySorting,
  applyPagination,
  (_: Request, res: Response<{}, { data: ScaleDoc[] }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)

router.get(
  '/scales/:id',
  (req: Request<ParamId>, res: Response, next: NextFunction) => {
    const { id: scaleId } = req.params
    if (scaleId)
      res.locals.query = { _id: stringToObjectId(scaleId) } as Partial<ScaleDoc>
    next()
  },
  async (_: Request, res: Response<{}, { query?: Partial<ScaleDoc>, data: ScaleDoc | null }>, next: NextFunction) => {
    const scaleDb = await db.scales.getOne(res.locals.query ?? {})
    res.locals.data = scaleDb
    next()
  },
  checkIfFound,
  (_: Request, res: Response<{}, { data: ScaleDoc | null }>) => {
    if (res.locals.data === null)
      res.status(404).json({ success: false })
    else
      res.status(200).json({ success: true, data: res.locals.data })
  }
)

export default router
