import type { Document } from 'mongoose'
import type { ObjectIdField } from 'types/db'

import mongoose from 'mongoose'


export const parseMongoDocumentToJSO = <T>(doc: Document<unknown, {}, T> & ObjectIdField) => {
  const { _id, ...rest } = doc.toObject()
  return { id: (_id as mongoose.Types.ObjectId).toString(), ...rest }
}