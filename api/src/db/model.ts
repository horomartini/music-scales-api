import type { INote } from 'api-types'

import mongoose from 'mongoose'

import schema from './schema'


const Notes = mongoose.model<INote>('notes', schema.notes)
// const Refs = mongoose.model<IRefRaw>('refs', refsSchema)


export default {
  Notes,
}