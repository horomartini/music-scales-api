import express from 'express'
import mongoose from 'mongoose'

import db from './db'
import { INote, ISound, IRef, IRefRaw, IRefPopulated } from 'interfaces'


const router = express.Router()

router.get('/test', async (req, res) => {
  try {
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
  } catch (err: any) {
    res.status(500).json({ message: 'error lol2', error: err?.message })
  }
})

router.get('/scales', (req, res) => {
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

  const returns = {
    return__variant1: [
      { name: 'scale 1' }, 
      { name: 'scale 2' },
    ],
    return__variant2__notes_Cs_D_G: [
      { name: 'scale 1', key: 'C#' }, 
      { name: 'scale 1', key: 'D' }, 
      { name: 'scale 1', key: 'G' },
    ],
    return__variant3__notes_Cs_D_G_Fs_B_E__group_by_name: [
      { name: 'scale 1', keys: ['C#', 'D', 'G'] }, 
      { name: 'scale 2', keys: ['F#', 'B', 'E'] },
    ],
    return__variant4__notes_Cs_e__group_by_key: [
      { key: 'C#', names: ['scale 1', 'scale 3'] }, 
      { key: 'E', names: ['scale 2', 'scale 4'] },
    ],
  }
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

router.get('/instruments/:instrument/tunings', (req, res) => {
  /**
   * @returns all possible tunings for this instrument
   */
  const returns = {
    return__variant1: [
      { name: 'E Standard', otherProps: '...' }
    ]
  }
})

router.get('/instruments/:instrument/tunings/:tuning', (req, res) => {
  /**
   * @returns layout/data of this tuning
   */
  const returns = {
    return__variant1: [
      { name: 'E Standard', notes: '...' }
    ]
  }
})

export default router
