import mongoose from 'mongoose'


type ObjectId = mongoose.Types.ObjectId

export type ObjectIdField = { '_id': ObjectId }

export type NoteDoc = ObjectIdField & {
  name: string
}

export type PhysicalNoteDoc = {
  note?: ObjectId
  octave: number
}

export type InstrumentDoc = ObjectIdField & {
  name: string
  defaultTuning?: ObjectId
}

export type TuningDoc = ObjectIdField & {
  name: string
  instrument?: ObjectId
  notes: PhysicalNoteDoc[]
}

export type ScaleDoc = ObjectIdField & {
  name: string
  steps: number[]
}
