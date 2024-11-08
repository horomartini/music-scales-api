import express from 'express'
import db from '../../db/sample-db'
import { INote, IPhysicalNote, IScale, IScaleExt } from 'api-types'
import { stepsToNotes } from '../../utils/scales'
import { handleError } from 'utils/errors'
import { parseNotes } from './utils/params'
import { isScaleExt } from '../../utils/types'

const router = express.Router()

router.get('/healthcheck', async (_, res) => {
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

router.get('/scales', async (req, res) => {
  /**
   * @returns all names of available scales
   * @param notes - give us scale in keys that work with those notes, e.g. `notes=E,F#4`
   * @param tuning - returns scales that match the given tuning
   * 
   * @param filter - filter name of scales, e.g. `filter=m*r`, default=(unset)
   * @param sort-by - sort by specific property, default=(unset)
   * @param order - order scales, e.g. `order=asc`, default=asc
   * @param group-by - group by specific property, e.g. `group-by=key`, default=(unset)
   * 
   * @param page - which page of result to return, default=1
   * @param limit - limit of items per page, default=(unset|unlimited)
   * 
   * @param hateoas - returns links of further traversal, e.g. `...?hateoas&...`, default=false
   * @param simplified - returns a simplified version of the result body if possible
   */

  const params = {
    notes: (req.query.notes ?? '') as string,
    tuning: (req.query.tuning ?? '') as string,
  }
  const scalesDb = db.getScales()

  let scales: (IScale | IScaleExt)[] = scalesDb

  if (params.notes !== '') {
    // parse notes from query params
    const notesToHave: (IPhysicalNote | INote)[] = parseNotes(params.notes)

    // get all possible notes
    const notes = db.getNotes()
   
    // TODO: scales =/= scalesDb, might throw errors at (scale as IScale)
    // get an array of scale objects
    const scalesWithKeys: IScaleExt[] = Object.values(scales.reduce((acc, scale) => {
      // get actual scale notes for every possible key
      //  and filter them with those that fit the query param criteria

      let scaleNotesWithRoots = (
        isScaleExt(scale)
          ? [scale].map(({ key, notes }) => ({ key, notes }))
          : notes.map(note => ({
            key: note.name,
            notes: stepsToNotes(note.name, (scale as IScale).steps, notes)
          }))
        ).filter(scale => notesToHave
          .map(note => note.name)
          .every(note => scale.notes.includes(note))
        )

      // replace scale steps with actual root and notes of scale
      const scalesWithRoots = scaleNotesWithRoots.map(scaleNotes => ({
        name: scale.name,
        keywords: scale.keywords,
        ...scaleNotes,
      }))

      // add all scales generated of same name but different root notes
      return { ...acc, ...scalesWithRoots }
    }, {}))

    scales = scalesWithKeys
  }

  // if (params.tuning !== '') {
  //   const tunings = db.getTunings()
  //   const tuningMatch = tunings.filter(({ name }) => name === params.tuning)

  //   if (tuningMatch.length > 0) {
  //     if (scales?.[0]?.key === undefined) {
  //       // TODO: param.notes were not defined - generate scales with root keys
  //     } else {
  //       scales.filter(scale => scale.notes)
  //     }
  //   }
  // }

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

router.get('/notes', (req, res) => {
  /**
   * @returns all notes available
   */
  const returns = {
    return__variant1: [
      { name: 'C' },
      { name: 'C#' },
    ]
  }
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

export default router
