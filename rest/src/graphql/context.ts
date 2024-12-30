// notes: new CrudCollection<Note, NoteDoc>('notes'),
//   instruments: new CrudCollection<Instrument, InstrumentDoc>('instruments'),
//   tunings: new CrudCollection<Tuning, TuningDoc>('tunings'),
//   scales: new CrudCollection<Scale, ScaleDoc>('scales'),

import type { Instrument, Note, Scale, Tuning } from 'types/api'
import type { InstrumentDoc, NoteDoc, ScaleDoc, TuningDoc } from 'types/db'

import { CrudCollection } from 'db/crud'

import db from '../db'


export interface ResolverContext {
  db: {
    notes: CrudCollection<Note, NoteDoc>
    instruments: CrudCollection<Instrument, InstrumentDoc>
    tunings: CrudCollection<Tuning, TuningDoc>
    scales: CrudCollection<Scale, ScaleDoc>
  }
}

export const createContext = (): ResolverContext => ({ db })