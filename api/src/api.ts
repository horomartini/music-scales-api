import express from 'express'
import mongoose from 'mongoose'

import db from './db'


const dbSample = {
  notes: [
    { note: "C" },
    { note: "C#" },
    { note: "D" },
    { note: "D#" },
    { note: "E" },
    { note: "F" },
    { note: "F#" },
    { note: "G" },
    { note: "G#" },
    { note: "A" },
    { note: "A#" },
    { note: "B" }
  ],
  tuning: [
    {
      instrument: "guitar",
      name: "E standard",
      notes: [
        { note: "E", octave: "2" },
        { note: "A", octave: "2" },
        { note: "D", octave: "3" },
        { note: "G", octave: "3" },
        { note: "B", octave: "3" },
        { note: "E", octave: "4" }
      ]
    }
  ],
  scales: [
    {
      name: "Ionian",
      // steps: [2, 2, 1, 2, 2, 2, 1],
      // idea: "give this and generate with POST the scale"
    }
  ]
}

const router = express.Router()

router.get('/test', async (req, res) => {
  try {
    const refs1 = await db.Note.countDocuments()
    const c = mongoose.connection.db?.collection('Note')
    const c2 = await c?.find().toArray()
    // console.log(await mongoose.connection.db?.listCollections().toArray())
    res.json({ message: 'test2', data: c2 })
  } catch (err: any) {
    res.status(500).json({ message: 'error lol2', error: err?.message })
  }
})

router.get('/scales', (req, res) => {
  /**
   * @returns all names of available scales
   * @param notes - give us scales that work with those notes, e.g. `notes=E,F`, default=(unset)
   * 
   * @param filter - filter name of scales, e.g. `filter=m*r`, default=(unset)
   * @param sort-by - sort by specific property, default=(unset)
   * @param order - order scales, e.g. `order=asc`, default=asc
   * 
   * @param page - which page of result to return, default=1
   * @param limit - limit of items per page, default=(unset|unlimited)
   */
})

router.get('/scales/:scale', (req, res) => {
  /**
   * @returns that specific scale and to work on it with keys
   * @param notes - give us scale in keys that work with those notes, e.g. `notes=E,F#4`
   */
})

router.get('/scales/:scale/:key', (req, res) => {
  /**
   * @returns that specific scale with that specific key
   * @alt '/scales/:key/:scale'
   */
})

router.get('/notes', (req, res) => {
  /**
   * @returns all notes available
   */
})

router.get('/instruments', (req, res) => {
  /**
   * @returns all supported instruments
   */
})

router.get('/instruments/:instrument', (req, res) => {
  /**
   * @returns all possible tunings for this instrument
   */
})

router.get('/instruments/:instrument/tunings/:tuning', (req, res) => {
  /**
   * @returns layout of this tuning
   */
})

export default router
