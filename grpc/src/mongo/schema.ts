import type { InstrumentDoc, NoteDoc, ScaleDoc, TuningDoc } from './types'

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
  notes: [{ 
    note: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'notes',
      required: true,
    }, 
    octave: { type: Number, required: true } 
  }],
} as const

const scalesSchemaDef = {
  name: { type: String, required: true },
  steps: { type: [Number], required: true },
} as const


const notesSchema = new mongoose.Schema<NoteDoc>(notesSchemaDef)
const instrumentsSchema = new mongoose.Schema<InstrumentDoc>(instrumentsSchemaDef)
const tuningsSchema = new mongoose.Schema<TuningDoc>(tuningsSchemaDef)
const scalesSchema = new mongoose.Schema<ScaleDoc>(scalesSchemaDef)


export default {
  notes: notesSchema,
  instruments: instrumentsSchema,
  tunings: tuningsSchema,
  scales: scalesSchema,
}
