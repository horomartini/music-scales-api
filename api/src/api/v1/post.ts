import type { Request, Response, NextFunction } from 'express'
import type { Note } from 'types/api'

import express from 'express'

import { checkBody } from '../../middleware/request'

import db from '../../db/crud'


const router = express.Router()


router.post(
  '/notes',
  (req: Request<{}, {}, Note | Note[], {}>, res: Response, next: NextFunction) => {
    res.locals.data = req.body
    res.locals.expected = {
      name: String(),
    }
    next()
  },
  checkBody<Note>,
  async (_: Request, res: Response<{}, { data: Note | Note[] }>, next: NextFunction) => {
    const data = res.locals.data
    Array.isArray(data)
      ? await db.postNotes(data)
      : await db.postNote(data)
    next()
  },
  (_: Request, res: Response) => {
    res
      .status(201)
      .json({ success: true })
  }
)


export default router
