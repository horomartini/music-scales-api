import type { NoteServiceServer } from '../proto/generated/note'

import mongoose from 'mongoose'

import { status as statusCode } from '@grpc/grpc-js'

import { Notes } from '../mongo/model'
import {
  parseProtoToMongoFilter,
  parseProtoToMongoId,
  parseMongoDocumentToJSO,
  parseProtoToMongoSort,
  parseProtoToMongoLimit,
  parseProtoToMongoSkip,
  getProtoPaginationData,
} from '../utils'

import Log from '@shared/logger'


export const noteService: NoteServiceServer = {
  getNote: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const [idError, id] = parseProtoToMongoId(call.request.id)

    if (idError !== null) {
      Log.error(`[400 :: <param.schema.failed>]`, idError)
      return callback({ code: statusCode.INVALID_ARGUMENT, message: idError }, null)
    }

    const noteDoc = await Notes.findById(id).exec()

    if (noteDoc === null) {
      Log.error(`[404 :: <db.find.failed>]`, `Note with id ${id} was not found`)
      return callback({ code: statusCode.NOT_FOUND, message: `Note with id ${id} was not found` }, null)
    }

    const note = parseMongoDocumentToJSO(noteDoc)
    const value = { note }

    Log.debug(`Request @ ${call.getPath()}`, { id })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  getNotes: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const query = parseProtoToMongoFilter(call.request.filter)
    const sort = parseProtoToMongoSort(call.request.orderBy)
    const limit = parseProtoToMongoLimit(call.request.pageSize)
    const skip = parseProtoToMongoSkip(call.request.pageToken, limit)

    const totalCount = await Notes.countDocuments()
    const unpaginatedQuery = await Notes.find(query).sort(sort)
    const [paginationError, { nextPageToken, totalPages }] = getProtoPaginationData(limit, skip, unpaginatedQuery.length)

    const noteDocs = await Notes.find(query).sort(sort).limit(limit).skip(paginationError ? 0 : skip).exec()
    const notes = noteDocs.map(parseMongoDocumentToJSO)
    const value = { notes, totalCount, nextPageToken, totalPages }

    Log.debug(`Request @ ${call.getPath()}`, { query, sort, limit, skip })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  addNote: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const noteToInsert = call.request

    if (!('name' in noteToInsert)) {
      Log.error(`[400 :: <param.schema.failed>]`, `Note is missing 'name' property`, noteToInsert)
      return callback({ code: statusCode.INVALID_ARGUMENT, message: `Note is missing 'name' property` }, null)
    }

    const noteDocs = await Notes.insertMany([noteToInsert])
    const noteDoc = noteDocs?.[0] ?? null

    if (noteDoc === null) {
      Log.error(`[500 :: <db.insert.failed>]`, `Note has not been returned after 'insertMany' call - result array is empty`)
      return callback({ code: statusCode.UNKNOWN }, null)
    }

    const note = parseMongoDocumentToJSO(noteDoc)
    const value = { note }

    Log.debug(`Request @ ${call.getPath()}`, noteToInsert)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  updateNote: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { id, ...params } = call.request
    const noteDoc = await Notes.findById(id)

    if (noteDoc === null) {
      Log.error(`[404 :: <db.find.failed>]`, `Note with id ${id} was not found`)
      return callback({ code: statusCode.NOT_FOUND, message: `Note with id ${id} was not found` }, null)
    }

    for (const [key, val] of Object.entries(noteDoc.toObject())) {
      if (key === '_id')
        continue

      if (key in params) {
        const newVal: typeof val = params[key as keyof typeof params] || val
        noteDoc.set(key, newVal)
      }
    }

    try {
      await noteDoc.save() // done this way to get validation, as per docs: https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
    }
    catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        Log.error(`[400 :: <db.validation.failed>]`, err.message)
        return callback({ code: statusCode.INVALID_ARGUMENT, message: err.message }, null)
      } 
      else throw err
    }
    
    const note = parseMongoDocumentToJSO(noteDoc)
    const value = { note }

    Log.debug(`Request @ ${call.getPath()}`, { id, ...params })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  deleteNote: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const [idError, id] = parseProtoToMongoId(call.request.id)

    if (idError !== null) {
      Log.error(`[400 :: <param.schema.failed>]`, idError)
      return callback({ code: statusCode.INVALID_ARGUMENT, message: idError }, null)
    }

    const { deletedCount } = await Notes.deleteOne({ _id: id }).exec()

    if (deletedCount !== 1) {
      Log.error(`[500 :: <db.delete.failed>]`, `Encountered issues when deleting note with id ${id}`, { deletedCount })
      return callback({ code: statusCode.UNKNOWN, message: `Encountered issues when deleting note with id ${id}` }, null)
    }

    const value = { id: id.toString() }

    Log.debug(`Request @ ${call.getPath()}`, { id })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
}
