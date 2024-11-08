import type { Request, Response } from 'express'
import type { INote, IPhysicalNote, IQueryFilter, IQueryHateoas, IQueryNotes, IQueryPaginator, IQuerySorter, IScale, IScaleExt } from 'api-types'

import express from 'express'

import db from '../../db/sample-db'

import { scaleToScaleExt } from '../../utils/scales'
import { applyBasicsFromParams, parseNote, parseNotes } from '../../utils/params'
import { applyFiltering, applyPagination, applySorting } from '../../utils/rest'
import { log } from '../../utils/logger'

const router = express.Router()

router.get('/healthcheck', async (_: Request, res: Response) => {
  try {
    res
      .status(200)
      .json({ message: 'success' })
  } catch (err: any) {
    res
      .status(500)
      .json({ message: 'failed', error: err?.message })
  }
})

router.get('/notes', (
  req: Request<{}, {}, {}, IQueryFilter 
    & IQuerySorter 
    & IQueryPaginator 
    & IQueryHateoas>, 
  res: Response,
) => {
  const params = {
    filterBy: (req.query.filter_by ?? '') as string,
    filterFor: (req.query.filter_for ?? '') as string,
    sortBy: (req.query.sort_by ?? '') as string,
    order: (req.query.order ?? 'asc') as 'asc' | 'desc',
    groupBy: (req.query.group_by ?? '') as string,
    page: (req.query.page ?? -1) as number,
    limit: (req.query.limit ?? -1) as number,
    hateoas: (req.query.hateoas ?? false) as boolean,
  }
  const notesDb = db.getNotes()

  let notes: INote[] = notesDb

  notes = applyBasicsFromParams(params, notes)

  res
    .status(200)
    .json({ data: notes })
})

router.get('/notes/:note', (
  req: Request<
    { note: string }, 
    {}, 
    {}, 
    IQueryHateoas
  >, 
  res: Response,
) => {
  const params = {
    note: parseNote(req.params.note ?? '') as IPhysicalNote | INote,
    hateoas: (req.query.hateoas ?? false) as boolean,
  }
  log('debug', params)
  const noteDb = db.getNote(params.note.name)

  if (noteDb === null) {
    res
      .status(404)
      .json({ message: `Note ${params.note.name} not found.` })
    return
  }

  let notes: INote = noteDb

  if (params.hateoas === true) {
    log('warn', 'Not implemented')
  }

  res
    .status(200)
    .json({ data: notes })
})

router.get('/instruments', (req, res) => {
  /**
   * @returns all supported instruments
   */
  const returns = {
    return__variant1: [
      { name: 'guitar', otherPops: '...' }
    ]
  }
})

router.get('/instruments/:instrument', (req, res) => {
  /**
   * @returns data for given instrument
   */
  const returns = {
    return__variant1: [
      { baseNotes: 6, otherProps: '...' }
    ]
  }
})

router.get('/tunings', (req, res) => {
  /**
   * @returns all possible tunings
   * 
   * filter for when you onyl want tunings for guitar
   */
  const returns = {
    return__variant1: [
      { name: 'E Standard', otherProps: '...' }
    ]
  }
})

router.get('/tunings/:tuning', (req, res) => {
  /**
   * @returns data for given tuning
   */
  const returns = {
    return__variant1: [
      { name: 'E Standard', notes: '...' }
    ]
  }
})

router.get('/scales', async (
  req: Request<{}, {}, {}, IQueryNotes 
    & IQueryFilter 
    & IQuerySorter 
    & IQueryPaginator 
    & IQueryHateoas>,
  res: Response,
) => {
  const scalesDb = db.getScales()
  const params = {
    notes: parseNotes(req.query.notes ?? '') as (IPhysicalNote | INote)[],
    filterBy: (req.query.filter_by ?? '') as string,
    filterFor: (req.query.filter_for ?? '') as string,
    sortBy: (req.query.sort_by ?? '') as string,
    order: (req.query.order ?? 'asc') as 'asc' | 'desc',
    groupBy: (req.query.group_by ?? '') as string,
    page: (req.query.page ?? -1) as number,
    limit: (req.query.limit ?? -1) as number,
    hateoas: (req.query.hateoas ?? false) as boolean,
  }

  let scales: (IScale | IScaleExt)[] = scalesDb

  if (params.notes.length > 0) {
    const notesDb = db.getNotes()

    scales = scalesDb.reduce<IScaleExt[]>((acc, scale) => [
      ...acc,
      ...scaleToScaleExt(scale, notesDb, params.notes)
    ], [])
  }

  if (params.filterBy !== '' && params.filterFor !== '') {
    scales = applyFiltering(scales, params.filterBy, params.filterFor)
  }

  if (params.sortBy !== '') {
    scales = applySorting(scales, params.sortBy, params.order)
  }

  if (params.groupBy !== '') {
    log('warn', 'Not implemented')
  }

  if (params.page !== -1) {
    scales = applyPagination(scales, params.page, params.limit)
  }

  if (params.hateoas === true) {
    log('warn', 'Not implemented')
  }

  res
    .status(200)
    .json(scales)
})

router.get('/scales/:scale', (req, res) => {
  /**
   * @returns that specific scale and to work on it with keys
   * @param notes - give us scale in keys that work with those notes, e.g. `notes=E,F#4`
   * @param keys - return scale of specified keys at most only, e.g. `keys=F`
   */

  const returns = {
    return__variant1: [
      { name: 'scale 1', steps: [1, 2, 3] },
    ],
    return__variant2__notes_E_F: [
      { name: 'scale 1', key: 'C', steps: [1, 2, 3] },
      { name: 'scale 1', key: 'D', steps: [1, 2, 3] },
    ],
    return__variant2__notes_E_F__keys_C: [
      { name: 'scale 1', key: 'C', steps: [1, 2, 3] },
    ],
  }
})

router.get('/test', async (req, res) => {
  try {
    /* //* old code from trying to get data from mongo
    const refs1 = await db.Notes.find()
    const refs2 = await db.Refs
      .findOne({ sound: { $exists: true } }, '-_id')
      .populate<IRefPopulated>({ path: 'sound.note', select: 'name -_id' })
      .lean()

    const refs3: ISound & { note: INote } = {
      ...refs2!.sound,
      name: refs2!.sound.note.name
    }
    const { note, ...refs4 } = refs3

    res.json({ message: 'test2', refs1, refs4 })
    */
    console.log(db.getNotes())
    console.log(db.getInstruments())
    console.log(db.getTunings())
    console.log(db.getScales())
    console.log(db.getRefs())

    res.json({ message: 'test' })
  } catch (err: any) {
    res.status(500).json({ message: 'error', error: err?.message })
  }
})

export default router
