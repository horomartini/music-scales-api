import { Instrument, Scale, Tuning, type Note } from 'types/api'

import mongoose from 'mongoose'

import schema from './schema'


// const Notes = mongoose.model<INote>('notes', schema.notes)
// const Refs = mongoose.model<IRefRaw>('refs', refsSchema)

const Notes = mongoose.model<Note>('notes', schema.notes)
const Instruments = mongoose.model<Instrument>('instruments', schema.instruments)
const Tunings = mongoose.model<Tuning>('tunings', schema.tunings)
const Scales = mongoose.model<Scale>('scales', schema.scales)

export default {
  Notes,
  Instruments,
  Tunings,
  Scales,
}