import mongoose from 'mongoose'

import { INote, IRefRaw } from './interfaces'


const notesSchemaDefinition = {
  name: { type: String, required: true },
} as const

const refsSchemaDefinition = {
  sound: {
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'notes', required: true },
    octave: { type: Number, required: true },
    pitch: { type: Number, required: true },
  }
} as const


const notesSchema = new mongoose.Schema<INote>(notesSchemaDefinition)
const refsSchema = new mongoose.Schema<IRefRaw>(refsSchemaDefinition)

const Notes = mongoose.model<INote>('notes', notesSchema)
const Refs = mongoose.model<IRefRaw>('refs', refsSchema)


export default {
  Notes, Refs
}