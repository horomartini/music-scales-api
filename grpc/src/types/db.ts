import type { Document, HydratedDocument } from 'mongoose'

import mongoose from 'mongoose'


export type ObjectId = mongoose.Types.ObjectId
export type ObjectIdField = { '_id': ObjectId }

export type NoteDoc = ObjectIdField & {
  name: string
}

export type PhysicalNoteDoc = {
  note: ObjectId
  octave: number
}

export type InstrumentDoc = ObjectIdField & {
  name: string
  defaultTuning?: ObjectId
}

export type TuningDoc = ObjectIdField & {
  name: string
  instrument?: ObjectId
  notes?: PhysicalNoteDoc[]
}

export type ScaleDoc = ObjectIdField & {
  name: string
  steps: number[]
}

export type CrudInterface<T> = {
  getOne: (id: string) => Promise<T | null>
  getMany: () => Promise<T[]>
  createOne: () => Promise<void>
  updateOne: () => Promise<void>
  deleteOne: () => Promise<void>
}
