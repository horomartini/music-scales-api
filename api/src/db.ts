import mongoose from 'mongoose'

import { INote, IRef } from './interfaces'


const noteSchemaDefinition = {
  name: { type: String, required: true },
} as const

const refSchemaDefinition = {
  sound: {
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    octave: { type: Number, required: true },
    pitch: { type: Number, required: true },
  }
} as const


const noteSchema = new mongoose.Schema<INote>(noteSchemaDefinition)
const refSchema = new mongoose.Schema<IRef>(refSchemaDefinition)

const Note = mongoose.model<INote>('Note', noteSchema)
const Ref = mongoose.model<IRef>('Ref', refSchema)


export default {
  Note, Ref
}