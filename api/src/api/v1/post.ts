import type { Request, Response, NextFunction } from 'express'
import type { Instrument, Note } from 'types/api'

import express from 'express'

import { checkLocalsData } from '../../middleware/request'

import db from '../../db'


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
  async (_: Request, res: Response<{}, { data: Note  }>, next: NextFunction) => {
    await db.notes.postOne(res.locals.data)
    next()
  },
  (_: Request, res: Response) => {
    res.status(201).json({ success: true })
  }
)

router.post(
  '/instruments',
  (req: Request<{}, {}, Instrument, {}>, res: Response, next: NextFunction) => {
    res.locals.data = req.body
    res.locals.schema = {
      name: { type: String, required: true },
      defaultTuning: { type: String },
    }
    next()
  },
  checkLocalsData<Instrument>,
  async (_: Request, res: Response<{}, { data: Instrument }>, next: NextFunction) => {
    await db.instruments.postOne(res.locals.data)
    next()
  },
  (_: Request, res: Response) => {
    res.status(201).json({ success: true })
  }
)


export default router
