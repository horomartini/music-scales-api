import type { Request, Response } from 'express'
import type { IInstrument, INote, IPhysicalNote, IScale, IScaleExt, ISound, ITuning, Pitch } from 'api-types'
import type { IParamInstrumentName, IParamNoteName, IParamScaleName, IParamTuningName, IQueryFilter, IQueryHateoas, IQueryLookup, IQueryNoteFrequencies, IQueryNoteReference, IQueryNotes, IQueryPaginator, IQuerySorter } from 'request-types'

import express from 'express'

import db from '../../db/sample-db'

import { scaleToScaleExt } from '../../utils/scales'
import { parseBooleanQuery, parseDeactivatorQuery, parseLiteralQuery, parseNote, parseNoteRef, parseNotes, parseNumberQuery, parseStringQuery } from '../../utils/params'
import { applyFiltering, applyPagination, applySorting } from '../../utils/rest'
import { log } from '../../utils/logger'
import { calcAbsFreq } from '../../utils/sound'

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

/**
 * @query_group IQueryNoteFrequencies - Queries for manipulating frequencies of notes.
 *   @query note_freq <empty|boolean> - Changes returned data structure from <INote[]> to <ISound[]> by calculating octaves and frequencies of available notes.
 * 
 * @query_group IQueryNoteReference - Sets reference sound. If any property is set, defaults to reference sound in server database.
 *   @query ref_name <string> - Note name, e.g. A.
 *   @query ref_octave <number> - Note octave, e.g. 4.
 *   @query ref_pitch <number> - Note pitch, e.g. 440.
 * 
 * @query_group IQueryFilter - Filters data before sending response.
 *   @query filter_by <string> - By which property to filter.
 *   @query filter_for <any> - What value to look for. TODO: Undefined behaviour for non-string values - FIX.
 * 
 * @query_group IQuerySorter - Sorts data before sending response.
 *   @query sort_by <string> - By which property to sort by. Takes values of this property into equation.
 *   @query order <'asc'|'desc'> - Ascending or descending order. For strings - alphabetical order.
 *   @query group_by <string> - Grouping same values of specified property into one object. TODO: Not implemented.
 * 
 * @query_group IQueryPaginator - Paginates data before sending response.
 *   @query page <number> - Number of the page. Values under 1 will default to first page. Values that result in going over the available pages will result in empty data.
 *   @query limit <number> - Entries per page. Values under 1 will default to 1 entry per page.
 * 
 * @query_group IQueryHateoas - Settings for REST's HATEOAS.
 *   @query hateoas <empty|boolean> - Toggles HATEOAS. TODO: Not implemented.
 * 
 * @returns
 *   @return_variant_1 <[{ name }]>
 *   @return_variant_2 <[{ name, octave, pitch }]>
 */
router.get('/notes', (
  req: Request<
    {}, 
    {}, 
    {}, 
    IQueryNoteFrequencies
      & IQueryNoteReference
      & IQueryFilter 
      & IQuerySorter 
      & IQueryPaginator 
      & IQueryHateoas>, 
  res: Response,
) => {
  const params = {
    noteFreq: parseBooleanQuery(req.query.note_freq),
    refName: parseStringQuery(req.query.ref_name),
    refOctave: parseNumberQuery(req.query.ref_octave),
    refPitch: parseNumberQuery(req.query.ref_pitch),
    filterBy: parseStringQuery(req.query.filter_by),
    filterFor: parseStringQuery(req.query.filter_for),
    sortBy: parseStringQuery(req.query.sort_by),
    order: parseLiteralQuery<'asc' | 'desc'>(req.query.order, 'asc'),
    groupBy: parseStringQuery(req.query.group_by),
    page: parseNumberQuery(req.query.page),
    limit: parseNumberQuery(req.query.limit),
    hateoas: parseBooleanQuery(req.query.hateoas),
  }
  const notesDb = db.getNotes()

  let notes: INote[] | ISound[] = notesDb

  if (params.noteFreq === true) {
    const noteRef = parseNoteRef(params.refName, params.refOctave, params.refPitch)
    const octaves = [...Array(9).keys()]
    const sounds = octaves.reduce<ISound[]>((acc, octave) => [
      ...acc,
      ...notesDb.map(({ name }) => ({
        name,
        octave,
        pitch: calcAbsFreq(
          { name, octave }, 
          noteRef, 
          notesDb.map(({ name }) => name)
        ),
      }))
    ], [])
    notes = sounds
  }

  if (params.filterBy !== '' && params.filterFor !== '') {
    notes = applyFiltering(notes, params.filterBy, params.filterFor)
  }

  if (params.sortBy !== '') {
    notes = applySorting(notes, params.sortBy, params.order)
  }

  if (params.groupBy !== '') {
    log('warn', 'Not implemented')
  }

  if (params.page !== -1) {
    notes = applyPagination(notes, params.page, params.limit)
  }

  if (params.hateoas === true) {
    log('warn', 'Not implemented')
  }

  res
    .status(200)
    .json({ data: notes })
})

/**
 * @param_group IParamNoteName
 *   @param note <string> - Name of the note.
 * 
 * @returns
 *   @return_variant_1 <{ name }>
 */
router.get('/notes/:note', (
  req: Request<
    IParamNoteName, 
    {}, 
    {}, 
    IQueryHateoas>, 
  res: Response,
) => {
  const params = {
    note: parseNote(req.params.note ?? '') as INote,
    hateoas: parseBooleanQuery(req.query.hateoas),
  }
  const noteDb = db.getNote(params.note.name)

  if (noteDb === null) {
    res
      .status(404)
      .json({ message: `Note ${params.note.name} not found.` })
    return
  }

  let note: INote = noteDb

  if (params.hateoas === true) {
    log('warn', 'Not implemented')
  }

  res
    .status(200)
    .json({ data: note })
})

/**
 * @returns
 *   @return_variant_1 <[{ name, baseNotes, defaultTuning }]>
 */
router.get('/instruments', (
  req: Request<
    {},
    {},
    {},
    IQueryFilter 
      & IQuerySorter 
      & IQueryPaginator 
      & IQueryHateoas>, 
  res: Response,
) => {
  const params = {
    filterBy: parseStringQuery(req.query.filter_by),
    filterFor: parseStringQuery(req.query.filter_for),
    sortBy: parseStringQuery(req.query.sort_by),
    order: parseLiteralQuery<'asc' | 'desc'>(req.query.order, 'asc'),
    groupBy: parseStringQuery(req.query.group_by),
    page: parseNumberQuery(req.query.page),
    limit: parseNumberQuery(req.query.limit),
    hateoas: parseBooleanQuery(req.query.hateoas),
  }
  const instrumentsDb = db.getInstruments()

  let instruments: IInstrument[] = instrumentsDb

  if (params.filterBy !== '' && params.filterFor !== '') {
    instruments = applyFiltering(instruments, params.filterBy, params.filterFor)
  }

  if (params.sortBy !== '') {
    instruments = applySorting(instruments, params.sortBy, params.order)
  }

  if (params.groupBy !== '') {
    log('warn', 'Not implemented')
  }

  if (params.page !== -1) {
    instruments = applyPagination(instruments, params.page, params.limit)
  }

  if (params.hateoas === true) {
    log('warn', 'Not implemented')
  }

  res
    .status(200)
    .json({ data: instruments })
})

/**
 * @returns
 *   @return_variant_1 <{ name, baseNotes, defaultTuning }>
 */
router.get('/instruments/:instrument', (
  req: Request<
    IParamInstrumentName,
    {},
    {},
    IQueryLookup
      & IQueryFilter 
      & IQuerySorter 
      & IQueryPaginator 
      & IQueryHateoas>, 
  res: Response,
) => {
  const params = {
    instrument: (req.params.instrument ?? '') as string,
    exactMatch: parseDeactivatorQuery(req.query.exact_match),
    hateoas: parseBooleanQuery(req.query.hateoas),
  }
  const instrumentDb = db.getInstrument(params.instrument, { exactMatch: params.exactMatch })

  if (instrumentDb === null) {
    res
      .status(404)
      .json({ message: `Instrument ${params.instrument} not found.` })
    return
  }

  let instrument: IInstrument = instrumentDb

  if (params.hateoas === true) {
    log('warn', 'Not implemented')
  }

  res
    .status(200)
    .json({ data: instrument })
})

/**
 * @returns
 *   @return_variant_1 <[{ name, instrument, notes<[{ name, octave }]> }]>
 */
router.get('/tunings', (
  req: Request<
    {}, 
    {}, 
    {}, 
    IQueryFilter 
      & IQuerySorter 
      & IQueryPaginator 
      & IQueryHateoas>, 
  res: Response,
) => {
  const params = {
    filterBy: parseStringQuery(req.query.filter_by),
    filterFor: parseStringQuery(req.query.filter_for),
    sortBy: parseStringQuery(req.query.sort_by),
    order: parseLiteralQuery<'asc' | 'desc'>(req.query.order, 'asc'),
    groupBy: parseStringQuery(req.query.group_by),
    page: parseNumberQuery(req.query.page),
    limit: parseNumberQuery(req.query.limit),
    hateoas: parseBooleanQuery(req.query.hateoas),
  }
  const tuningsDb = db.getTunings()

  let tunings: ITuning[] = tuningsDb

  if (params.filterBy !== '' && params.filterFor !== '') {
    tunings = applyFiltering(tunings, params.filterBy, params.filterFor)
  }

  if (params.sortBy !== '') {
    tunings = applySorting(tunings, params.sortBy, params.order)
  }

  if (params.groupBy !== '') {
    log('warn', 'Not implemented')
  }

  if (params.page !== -1) {
    tunings = applyPagination(tunings, params.page, params.limit)
  }

  if (params.hateoas === true) {
    log('warn', 'Not implemented')
  }

  res
    .status(200)
    .json({ data: tunings })
})

/**
 * @returns
 *   @return_variant_1 <{ name, instrument, notes<[{ name, octave }]> }>
 */
router.get('/tunings/:tuning', (
  req: Request<
    IParamTuningName, 
    {}, 
    {}, 
    IQueryLookup
      & IQueryHateoas>, 
  res: Response,
) => {
  const params = {
    tuning: (req.params.tuning ?? '') as string,
    exactMatch: parseDeactivatorQuery(req.query.exact_match),
    hateoas: parseBooleanQuery(req.query.hateoas),
  }
  const tuningDb = db.getTuning(params.tuning, { exactMatch: params.exactMatch })

  if (tuningDb === null) {
    res
      .status(404)
      .json({ message: `Tuning ${params.tuning} not found.` })
    return
  }

  let tuning: ITuning = tuningDb

  if (params.hateoas === true) {
    log('warn', 'Not implemented')
  }

  res
    .status(200)
    .json({ data: tuning })
})

/**
 * @returns
 *   @return_variant_1 <[{ name, steps<number[]> }]>
 *   @return_variant_2 <[{ name, key, notes<string[]> }]>
 */
router.get('/scales', async (
  req: Request<
    {}, 
    {}, 
    {}, 
    IQueryNotes 
      & IQueryFilter 
      & IQuerySorter 
      & IQueryPaginator 
      & IQueryHateoas>,
  res: Response,
) => {
  const params = {
    notes: parseNotes(req.query.notes),
    filterBy: parseStringQuery(req.query.filter_by),
    filterFor: parseStringQuery(req.query.filter_for),
    sortBy: parseStringQuery (req.query.sort_by),
    order: parseLiteralQuery<'asc' | 'desc'>(req.query.order,'asc'),
    groupBy: parseStringQuery(req.query.group_by) ,
    page: parseNumberQuery(req.query.page),
    limit: parseNumberQuery(req.query.limit),
    hateoas: parseBooleanQuery(req.query.hateoas),
  }
  const scalesDb = db.getScales()

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

/**
 * @returns
 *   @return_variant_1 <{ name, steps<number[]> }>
 */
router.get('/scales/:scale', (
  req: Request<
    IParamScaleName, 
    {}, 
    {}, 
    IQueryLookup
      & IQueryHateoas>, 
  res: Response,
) => {
  const params = {
    scale: (req.params.scale ?? '') as string,
    exactMatch: parseDeactivatorQuery(req.query.exact_match),
    hateoas: parseBooleanQuery(req.query.hateoas),
  }
  const scaleDb = db.getScale(params.scale, { exactMatch: params.exactMatch })

  if (scaleDb === null) {
    res
      .status(404)
      .json({ message: `Scale ${params.scale} not found.` })
    return
  }

  let scale: IScale = scaleDb

  if (params.hateoas === true) {
    log('warn', 'Not implemented')
  }

  res
    .status(200)
    .json({ data: scale })
})

export default router
