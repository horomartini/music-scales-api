import type { InstrumentDoc, NoteDoc, ScaleDoc, TuningDoc } from 'types/db'

import mongoose, { Model } from 'mongoose'

import schema from './schema'

const Notes: Model<NoteDoc> = mongoose.model<NoteDoc>('notes', schema.notes)
const Instruments: Model<InstrumentDoc> = mongoose.model<InstrumentDoc>('instruments', schema.instruments)
const Tunings: Model<TuningDoc> = mongoose.model<TuningDoc>('tunings', schema.tunings)
const Scales: Model<ScaleDoc> = mongoose.model<ScaleDoc>('scales', schema.scales)

export default {
  Notes,
  Instruments,
  Tunings,
  Scales,
}