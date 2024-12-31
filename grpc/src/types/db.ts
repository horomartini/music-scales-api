import mongoose, { type Document } from 'mongoose'

export type ObjectId = mongoose.Types.ObjectId
export type ObjectIdField = { '_id': ObjectId }

export type NoteDoc = ObjectIdField & Document & {
  name: string
}

export type InstrumentDoc = ObjectIdField & Document & {
  name: string
  defaultTuning?: ObjectId
}

export type TuningDoc = ObjectIdField & Document & {
  name: string
  instrument?: ObjectId
  notes?: TuningNote[]
}

export type ScaleDoc = ObjectIdField & Document & {
  name: string
  steps: number[]
}

export type TuningNote = {
  note: ObjectId
  octave: number
}
