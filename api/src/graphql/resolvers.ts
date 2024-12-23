import { InstrumentDoc, TuningDoc, TuningNote } from 'types/db'

import db from '../db'


export const resolvers = {
  Query: {
    notes: async () => await db.notes.getMany(),
    instruments: async () => await db.instruments.getMany(),
    tunings: async () => await db.tunings.getMany(),
    scales: async () => await db.scales.getMany(),
  },
  Instrument: {
    defaultTuning: async (parent: InstrumentDoc) => await db.tunings.getOne({ _id: parent.defaultTuning }),
  },
  Tuning: {
    instrument: async (parent: TuningDoc) => await db.instruments.getOne({ _id: parent.instrument }),
  },
  TuningNotes: {
    note: async (parent: TuningNote) => await db.notes.getOne({ _id: parent.note }),
  },
}