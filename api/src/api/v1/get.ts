import type { NextFunction, Request, Response } from 'express'
import type { ParamId, ParamInstrumentName, ParamNoteName } from 'types/req'
import type { Note } from 'types/api'
import type { InstrumentDoc, NoteDoc } from 'types/db'

import express from 'express'

import { applyFiltering, applyPagination, applySorting } from '../../middleware/response'

import db from '../../db/crud'

import { parseNote } from '../../utils/parse'
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
    const notesDb = await db.getNotes()
    res.locals.data = notesDb
    next()
  }, 
  applyFiltering,
  applySorting,
  applyPagination,
  (_: Request, res: Response<{}, { data: NoteDoc[] }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)

router.get(
  '/notes/:id',
  (req: Request<ParamId>, res: Response, next: NextFunction) => {
    const { id: noteId } = req.params
    if (noteId !== undefined)
      res.locals.query = { _id: stringToObjectId(noteId) } as Partial<NoteDoc>
    // if (noteName !== undefined)
    //   res.locals.query = parseNote(noteName) as Partial<Note>
    next()
  },
  async (_: Request, res: Response<{}, { query?: Partial<NoteDoc>, data: NoteDoc | null }>, next: NextFunction) => {
    const noteDb = await db.getNote(res.locals.query ?? {})
    res.locals.data = noteDb
    next()
  },
  (_: Request, res: Response<{}, { data: NoteDoc | null }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)

router.get(
  '/instruments',
  async (_: Request, res: Response, next: NextFunction) => {
    const instrumentsDb = await db.getInstruments()
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
    if (instrumentId !== undefined)
      res.locals.query = { _id: stringToObjectId(instrumentId) } as Partial<InstrumentDoc>
    // if (instrumentName !== undefined)
    //   res.locals.query = { name: instrumentName } as Partial<InstrumentDoc>
    next()
  },
  async (_: Request, res: Response<{}, { query?: Partial<InstrumentDoc>, data: InstrumentDoc | null }>, next: NextFunction) => {
    const instrumentDb = await db.getInstrument(res.locals.query ?? {})
    res.locals.data = instrumentDb
    next()
  },
  (_: Request, res: Response<{}, { data: InstrumentDoc | null }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)

export default router
