import type { InstrumentDoc, NoteDoc, ScaleDoc, TuningDoc } from './types'

import mongoose from 'mongoose'

import schema from './schema'


export const Notes = mongoose.model<NoteDoc>('notes', schema.notes)
export const Instruments = mongoose.model<InstrumentDoc>('instruments', schema.instruments)
export const Tunings = mongoose.model<TuningDoc>('tunings', schema.tunings)
export const Scales = mongoose.model<ScaleDoc>('scales', schema.scales)


export default {
  notes: Notes,
  instruments: Instruments,
  tunings: Tunings,
  scales: Scales,
}
