import type { INote } from 'api-types'

import mongoose from 'mongoose'


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
// const refsSchema = new mongoose.Schema<IRefRaw>(refsSchemaDefinition)


export default {
  notes: notesSchema,
  // refs: refsSchema,
}