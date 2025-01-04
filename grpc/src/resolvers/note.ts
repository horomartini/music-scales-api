import type { NoteServiceServer } from '../proto/generated/note'
import type { NoteDoc } from '../mongo/types'

import mongoose from 'mongoose'

import { status as statusCode } from '@grpc/grpc-js'

import { UpdateNoteRequest } from '../proto/generated/note'
import { Notes } from '../mongo/model'
import {
  parseProtoToMongoFilter,
  parseProtoToMongoSort,
  parseProtoToMongoLimit,
  parseProtoToMongoSkip,
  getProtoPaginationData,
} from '../utils'

import Log from '@shared/logger'


export const noteService: NoteServiceServer = {
  getNote: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { id } = call.request

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const noteDoc = await Notes.findById(id).exec()

    if (noteDoc === null) {
      const message = `Note with id ${id} was not found`
      Log.error(`[404 :: <db.find.failed>]`, message)
      return callback({ code: statusCode.NOT_FOUND, message }, null)
    }

    const note = {
      id: noteDoc._id.toString(),
      name: noteDoc.name,
    }
    const value = { note }

    Log.debug(`Request @ ${call.getPath()}`, call.request)
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
    const notes = noteDocs.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
    }))
    const value = { notes, totalCount, nextPageToken, totalPages }

    Log.debug(`Request @ ${call.getPath()}`, call.request, { query, sort, limit, skip })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  addNote: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { name } = call.request

    if (name === '') {
      const message = `Note is missing required property: name`
      Log.error(`[400 :: <param.schema.failed>]`, message, call.request)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const noteToInsert: Omit<NoteDoc, '_id'> = {
      name: name
    }

    const noteDocs = await Notes.insertMany([noteToInsert]) // TODO: replace with doc.save()
    const noteDoc = noteDocs?.[0] ?? null

    if (noteDoc === null) {
      const message = `Note has not been returned after 'insertMany' call - result array is empty`
      Log.error(`[500 :: <db.insert.failed>]`, message, noteDocs)
      return callback({ code: statusCode.UNKNOWN }, null)
    }

    const note = {
      id: noteDoc._id.toString(),
      name: noteDoc.name,
    }
    const value = { note }

    Log.debug(`Request @ ${call.getPath()}`, call.request, noteToInsert)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  updateNote: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { id, ...fields } = call.request
    const defaultFields = UpdateNoteRequest.create()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const noteDoc = await Notes.findById(id)

    if (noteDoc === null) {
      const message = `Note with id ${id} was not found`
      Log.error(`[404 :: <db.find.failed>]`, message)
      return callback({ code: statusCode.NOT_FOUND, message }, null)
    }

    for (const [key, defaultValue] of Object.entries(defaultFields)) {
      if (!(key in fields))
        continue

      const newVal = fields[key as keyof typeof fields]

      if (newVal === defaultValue)
        continue

      noteDoc.set(key, newVal)
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
    
    const note = {
      id: noteDoc._id.toString(),
      name: noteDoc.name,
    }
    const value = { note }

    Log.debug(`Request @ ${call.getPath()}`, call.request)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  deleteNote: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { id } = call.request

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const { deletedCount } = await Notes.deleteOne({ _id: id }).exec()

    if (deletedCount !== 1) {
      const message = `Encountered issue when deleting note with id ${id} - deletedCount !== 1`
      Log.error(`[500 :: <db.delete.failed>]`, message)
      return callback({ code: statusCode.UNKNOWN }, null)
    }

    const value = { id: id.toString() }

    Log.debug(`Request @ ${call.getPath()}`, call.request)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
}
