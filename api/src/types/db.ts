import type { Instrument, Note, PhysicalNote, Tuning, Scale } from './api'

import { Types as mongooseTypes } from 'mongoose'


export type ObjectId = mongooseTypes.ObjectId
export type ObjectIdField = { '_id': ObjectId }

export type NoteDoc = ObjectIdField & {
  name: string
}

export type InstrumentDoc = ObjectIdField & {
  name: string
  defaultTuning: ObjectIdField
}

export type TuningDoc = ObjectIdField & {
  name: string
  instrument: ObjectIdField
  notes: PhysicalNote[] | null
}

export type ScaleDoc = ObjectIdField & {
  name: string
  steps: number[]
}
