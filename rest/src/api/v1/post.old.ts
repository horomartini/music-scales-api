import type { Request, Response } from 'express'

import express from 'express'
import db from '../../db/sample-db'
import { INote, IScale } from 'api-types'
import { getPrintableInterfaceType, isInterface } from '../../utils/types'
import { log } from '../../utils/logger'

const router = express.Router()

const doPost = <T extends object>(
  req: Request, 
  res: Response, 
  addOne: (body: T) => void, 
  addMany: (body: T[]) => void,
  expectedBody: T, 
) => {
  const body: T | T[] = req.body
  const isBulkPost = Array.isArray(body)
  const isParsed = isBulkPost
    ? body
      .map(item => isInterface<T>(expectedBody, item))
      .every(result => result === true)
    : isInterface<T>(expectedBody, body)
  
  if (!isParsed) {
    res
      .status(400)
      .json({ 
        message: `Body of wrong type was given.`,
        expectedType: `${getPrintableInterfaceType(expectedBody)} | []`,
      })
    return
  }

  isBulkPost 
    ? addMany(body) 
    : addOne(body)
  res
    .status(201)
    .json({})
}

router.post('/notes', (req, res) => {
  doPost(req, res, db.addNote, db.addNotes, {
    name: String(),
  })
})

router.post('/instruments', (req, res) => {
  doPost(req, res, db.addInstrument, db.addInstruments, {
    name: String(),
    baseNotes: Number(),
    defaultTuning: String(),
  })
})

router.post('/tunings', (req, res) => {
  doPost(req, res, db.addTuning, db.addTunings, {
    name: String(),
    instrument: String(),
    notes: [{ name: String(), octave: Number() }],
  })
})

router.post('/scales', (req, res) => {
  doPost(req, res, db.addScale, db.addScales, {
    name: String(),
    keywords: [String()],
    steps: [Number()],
  })
})

export default router
