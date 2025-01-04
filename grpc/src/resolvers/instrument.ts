import type { InstrumentServiceServer } from '../proto/__generated__/instrument'
import type { InstrumentDoc } from '../mongo/types'

import mongoose from 'mongoose'

import { status as statusCode } from '@grpc/grpc-js'

import { UpdateInstrumentRequest } from '../proto/__generated__/instrument'
import { Instruments } from '../mongo/model'
import {
  parseProtoToMongoFilter,
  parseProtoToMongoSort,
  parseProtoToMongoLimit,
  parseProtoToMongoSkip,
  getProtoPaginationData,
} from '../utils'

import Log from '@shared/logger'


export const instrumentService: InstrumentServiceServer = {
  getInstrument: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { id } = call.request

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const instrumentDoc = await Instruments.findById(id).exec()

    if (instrumentDoc === null) {
      const message = `Instrument with id ${id} was not found`
      Log.error(`[404 :: <db.find.failed>]`, message)
      return callback({ code: statusCode.NOT_FOUND, message }, null)
    }

    const instrument = {
      id: instrumentDoc._id.toString(),
      name: instrumentDoc.name,
      defaultTuningId: instrumentDoc.defaultTuning?.toString() ?? '',
    }
    const value = { instrument }
    
    Log.debug(`Request @ ${call.getPath()}`, call.request)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  getInstruments: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const query = parseProtoToMongoFilter(call.request.filter)
    const sort = parseProtoToMongoSort(call.request.orderBy)
    const limit = parseProtoToMongoLimit(call.request.pageSize)
    const skip = parseProtoToMongoSkip(call.request.pageToken, limit)

    const totalCount = await Instruments.countDocuments()
    const unpaginatedQuery = await Instruments.find(query).sort(sort)
    const [paginationError, { nextPageToken, totalPages }] = getProtoPaginationData(limit, skip, unpaginatedQuery.length)

    const instrumentDocs = await Instruments.find(query).sort(sort).limit(limit).skip(paginationError ? 0 : skip).exec()
    const instruments = instrumentDocs.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      defaultTuningId: doc.defaultTuning?.toString() ?? '',
    }))
    const value = { instruments, totalCount, nextPageToken, totalPages }

    Log.debug(`Request @ ${call.getPath()}`, call.request, { query, sort, limit, skip })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  addInstrument: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { name, defaultTuningId } = call.request

    if (name === '') {
      const message = `Instrument is missing required property: name`
      Log.error(`[400 :: <param.schema.failed>]`, message, call.request)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    if (defaultTuningId !== '' && !mongoose.Types.ObjectId.isValid(defaultTuningId)) {
      const message = `DefaultTuningId ${defaultTuningId} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const instrumentToInsert: Omit<InstrumentDoc, '_id'> = {
      name: name,
      defaultTuning: defaultTuningId === '' ? undefined : new mongoose.Types.ObjectId(defaultTuningId),
    }

    const instrumentDocs = await Instruments.insertMany([instrumentToInsert]) // TODO: replace with doc.save()
    const instrumentDoc = instrumentDocs?.[0] ?? null

    if (instrumentDoc === null) {
      const message = `Instrument has not been returned after 'insertMany' call - result array is empty`
      Log.error(`[500 :: <db.insert.failed>]`, message, instrumentDocs)
      return callback({ code: statusCode.UNKNOWN }, null)
    }

    const instrument = {
      id: instrumentDoc._id.toString(),
      name: instrumentDoc.name,
      defaultTuningId: instrumentDoc.defaultTuning?.toString() ?? ''
    }
    const value = { instrument }

    Log.debug(`Request @ ${call.getPath()}`, call.request, instrumentToInsert)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  updateInstrument: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { id, ...fields} = call.request
    const defaultFields = UpdateInstrumentRequest.create()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const instrumentDoc = await Instruments.findById(id)

    if (instrumentDoc === null) {
      const message = `Instrument with id ${id} was not found`
      Log.error(`[404 :: <db.find.failed>]`, message)
      return callback({ code: statusCode.NOT_FOUND, message }, null)
    }

    for (const [key, defaultValue] of Object.entries(defaultFields)) {
      if (!(key in fields))
        continue

      const newVal = fields[key as keyof typeof fields]

      if (newVal === defaultValue)
        continue

      instrumentDoc.set(key, newVal)
    }

    try {
      await instrumentDoc.save() // done this way to get validation, as per docs: https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
    }
    catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        Log.error(`[400 :: <db.validation.failed>]`, err.message)
        return callback({ code: statusCode.INVALID_ARGUMENT, message: err.message }, null)
      } 
      else throw err
    }

    const instrument = {
      id: instrumentDoc._id.toString(),
      name: instrumentDoc.name,
      defaultTuningId: instrumentDoc.defaultTuning?.toString() ?? '',
    }
    const value = { instrument }

    Log.debug(`Request @ ${call.getPath()}`, call.request)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  deleteInstrument: async (call, callback) => {
    Log.info('gRPC @', call.getPath())

    const { id } = call.request

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const { deletedCount } = await Instruments.deleteOne({ _id: id }).exec()

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
