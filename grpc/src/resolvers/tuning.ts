import type { TuningServiceServer } from '../proto/generated/tuning'
import type { TuningDoc } from '../mongo/types'

import mongoose from 'mongoose'

import { status as statusCode } from '@grpc/grpc-js'

import { UpdateTuningRequest } from '../proto/generated/tuning'
import { Tunings } from '../mongo/model'
import {
  parseProtoToMongoFilter,
  parseProtoToMongoSort,
  parseProtoToMongoLimit,
  parseProtoToMongoSkip,
  getProtoPaginationData,
} from '../utils'

import Log from '@shared/logger'


export const tuningService: TuningServiceServer = {
  getTuning: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { id } = call.request

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const tuningDoc = await Tunings.findById(id).exec()

    if (tuningDoc === null) {
      const message = `Tuning with id ${id} was not found`
      Log.error(`[404 :: <db.find.failed>]`, message)
      return callback({ code: statusCode.NOT_FOUND, message }, null)
    }

    const tuning = {
      id: tuningDoc._id.toString(),
      name: tuningDoc.name,
      instrumentId: tuningDoc.instrument?.toString() ?? '',
      notes: tuningDoc.notes.map(({ note, octave }) => ({ noteId: note?.toString() ?? '', octave })),
    }
    const value = { tuning }

    Log.debug(`Request @ ${call.getPath()}`, call.request)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  getTunings: async (call, callback) => {
    Log.info('gRPC @', call.getPath())
    
    const query = parseProtoToMongoFilter(call.request.filter)
    const sort = parseProtoToMongoSort(call.request.orderBy)
    const limit = parseProtoToMongoLimit(call.request.pageSize)
    const skip = parseProtoToMongoSkip(call.request.pageToken, limit)

    const totalCount = await Tunings.countDocuments()
    const unpaginatedQuery = await Tunings.find(query).sort(sort)
    const [paginationError, { nextPageToken, totalPages }] = getProtoPaginationData(limit, skip, unpaginatedQuery.length)

    const tuningDocs = await Tunings.find(query).sort(sort).limit(limit).skip(paginationError ? 0 : skip).exec()
    const tunings = tuningDocs.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      instrumentId: doc.instrument?.toString() ?? '',
      notes: doc.notes.map(({ note, octave }) => ({ noteId: note?.toString() ?? '', octave })),
    }))
    const value = { tunings, totalCount, nextPageToken, totalPages }

    Log.debug(`Request @ ${call.getPath()}`, call.request, { query, sort, limit, skip })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  addTuning: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { name, instrumentId, notes } = call.request

    if (name === '') {
      const message = `Tuning is missing required property: name`
      Log.error(`[400 :: <param.schema.failed>]`, message, call.request)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    if (instrumentId !== '' && !mongoose.Types.ObjectId.isValid(instrumentId)) {
      const message = `InstrumentId ${instrumentId} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message, call.request)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    if (notes.length !== 0 && notes.some(({ noteId }) => noteId !== '' && !mongoose.Types.ObjectId.isValid(noteId))) {
      const message = `Some noteIds are not valid ObjectIds`
      Log.error(`[400 :: <param.schema.failed>]`, message, call.request)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const tuningToInsert: Omit<TuningDoc, '_id'> = {
      name: name,
      instrument: instrumentId === '' ? undefined : new mongoose.Types.ObjectId(instrumentId),
      notes: notes.map(({ noteId, octave }) => ({ note: noteId === '' ? undefined : new mongoose.Types.ObjectId(noteId), octave })),
    }

    const tuningDocs = await Tunings.insertMany([tuningToInsert]) // TODO: replace with doc.save()
    const tuningDoc = tuningDocs?.[0] ?? null

    if (tuningDoc === null) {
      const message = `Tuning has not been returned after 'insertMany' call - result array is empty`
      Log.error(`[500 :: <db.insert.failed>]`, message, tuningDocs)
      return callback({ code: statusCode.UNKNOWN }, null)
    }

    const tuning = {
      id: tuningDoc._id.toString(),
      name: tuningDoc.name,
      instrumentId: tuningDoc.instrument?.toString() ?? '',
      notes: tuningDoc.notes.map(({ note, octave }) => ({ noteId: note?.toString() ?? '', octave })),
    }
    const value = { tuning }

    Log.debug(`Request @ ${call.getPath()}`, call.request, tuningToInsert)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  updateTuning: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { id, ...fields} = call.request
    const defaultFields = UpdateTuningRequest.create()
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const tuningDoc = await Tunings.findById(id)

    if (tuningDoc === null) {
      const message = `Tuning with id ${id} was not found`
      Log.error(`[404 :: <db.find.failed>]`, message)
      return callback({ code: statusCode.NOT_FOUND, message }, null)
    }

    for (const [key, defaultValue] of Object.entries(defaultFields)) {
      if (!(key in fields))
        continue

      const newVal = fields[key as keyof typeof fields]

      if (Array.isArray(newVal) && newVal.length === 0)
        continue

      if (newVal === defaultValue)
        continue

      tuningDoc.set(key, newVal)
    }

    try {
      await tuningDoc.save() // done this way to get validation, as per docs: https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
    }
    catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        Log.error(`[400 :: <db.validation.failed>]`, err.message)
        return callback({ code: statusCode.INVALID_ARGUMENT, message: err.message }, null)
      } 
      else throw err
    }

    const tuning = {
      id: tuningDoc._id.toString(),
      name: tuningDoc.name,
      instrumentId: tuningDoc.instrument?.toString() ?? '',
      notes: tuningDoc.notes.map(({ note, octave }) => ({ noteId: note?.toString() ?? '', octave })),
    }
    const value = { tuning }

    Log.debug(`Request @ ${call.getPath()}`, call.request)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  deleteTuning: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { id } = call.request

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const { deletedCount } = await Tunings.deleteOne({ _id: id }).exec()

    if (deletedCount !== 1) {
      const message = `Encountered issue when deleting instrument with id ${id} - deletedCount !== 1`
      Log.error(`[500 :: <db.delete.failed>]`, message)
      return callback({ code: statusCode.UNKNOWN }, null)
    }

    const value = { id: id.toString() }

    Log.debug(`Request @ ${call.getPath()}`, call.request)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
}
