import type { Instrument, Note, Scale, Tuning } from 'types/api'

import mongoose from 'mongoose'

const notesSchemaDef = {
  name: { type: String, required: true },
} as const

const instrumentsSchemaDef = {
  name: { type: String, required: true },
  defaultTuning: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tunings',
  },
} as const

const tuningsSchemaDef = {
  name: { type: String, required: true },
  instrument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'instruments',
  },
  notes: [{ name: String, octave: Number }],
} as const

const scalesSchemaDef = {
  name: { type: String, required: true },
  steps: { type: [Number], required: true },
} as const

const notesSchema = new mongoose.Schema<Note>(notesSchemaDef)
const instrumentsSchema = new mongoose.Schema<Instrument>(instrumentsSchemaDef)
const tuningsSchema = new mongoose.Schema<Tuning>(tuningsSchemaDef)
const scalesSchema = new mongoose.Schema<Scale>(scalesSchemaDef)

export default {
  notes: notesSchema,
  instruments: instrumentsSchema,
  tunings: tuningsSchema,
  scales: scalesSchema,
}
