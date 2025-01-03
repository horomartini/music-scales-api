import type { Document } from 'mongoose'
import type { ObjectIdField } from 'types/db'

import mongoose from 'mongoose'


export const parseMongoDocumentToJSO = <T>(doc: Document<unknown, {}, T> & ObjectIdField) => {
  const { _id, ...rest } = doc.toObject()
  return { id: (_id as mongoose.Types.ObjectId).toString(), ...rest }
}

export const parseMongoDocumentToPOJO = <T, R>(doc: Document<unknown, {}, T> & ObjectIdField, fieldsToRename: Partial<Record<keyof T, keyof R>>) => {
  const { _id, ...rest } = doc.toObject()

  const pojo = { 
    id: (_id as mongoose.Types.ObjectId).toString(),
    ...Object.entries(rest).reduce((acc, [key, val]) => {
      if (key === '_id')
        return acc
      if (key in fieldsToRename) 
        return { ...acc, [fieldsToRename[key as keyof T] as string]: val }
      return { ...acc, [key]: val }
    }, {})
  }

  return pojo
}