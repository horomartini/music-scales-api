import type { PhysicalNote } from './api'

import mongoose from 'mongoose'


export type ObjectId = mongoose.Types.ObjectId
export type ObjectIdField = { '_id': ObjectId }

export type NoteDoc = ObjectIdField & {
  name: string
}

export type InstrumentDoc = ObjectIdField & {
  name: string
  defaultTuning?: ObjectId
}

export type TuningDoc = ObjectIdField & {
  name: string
  instrument?: ObjectId
  notes?: TuningNote[]
}

export type ScaleDoc = ObjectIdField & {
  name: string
  steps: number[]
}

export type TuningNote = {
  note: ObjectId
  octave: number
}
