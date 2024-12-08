import type { NextFunction, Request, Response } from 'express'
import type { ParamNoteName } from 'types/req'
import type { Note } from 'types/api'
import type { NoteDoc } from 'types/db'

import express from 'express'

import { applyFiltering, applyPagination, applySorting } from '../../middleware/response'

import db from '../../db/crud'

import { parseNote } from '../../utils/parse'


const router = express.Router()

router.get(
  '/healthcheck', 
  async (_: Request, res: Response) => {
    res
      .status(200)
      .json({ success: true, message: 'success' })
  }
)

router.get(
  '/notes', 
  (_: Request, res: Response, next: NextFunction) => {
    const notesDb = db.getNotes()
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
  '/notes/:note',
  (req: Request<ParamNoteName>, res: Response, next: NextFunction) => {
    const { note: noteName } = req.params
    if (noteName !== undefined) {
      res.locals.query = parseNote(noteName) as Partial<Note>
    }
    next()
  },
  (_: Request, res: Response<{}, { query?: Partial<Note>, data: NoteDoc | null }>, next: NextFunction) => {
    const noteDb = db.getNote(res.locals.query ?? {})
    res.locals.data = noteDb
    next()
  },
  (_: Request, res: Response<{}, { data: NoteDoc | null }>) => {
    res.status(200).json({ success: true, data: res.locals.data })
  }
)

export default router
