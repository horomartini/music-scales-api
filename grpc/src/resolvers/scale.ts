import type { ScaleServiceServer } from '../proto/generated/scale'

import mongoose from 'mongoose'

import { status as statusCode } from '@grpc/grpc-js'

import { Scales } from '../mongo/model'
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


export const scaleService: ScaleServiceServer = {
  getScale: async (call, callback) => { // TODO: changed: scaleDoc, Scales, Scale, scale
    Log.info('gRPC @', call.getPath())
    
    const [idError, id] = parseProtoToMongoId(call.request.id)

    if (idError !== null) {
      Log.error(`[400 :: <param.schema.failed>]`, idError)
      return callback({ code: statusCode.INVALID_ARGUMENT, message: idError }, null)
    }

    const scaleDoc = await Scales.findById(id).exec()

    if (scaleDoc === null) {
      Log.error(`[404 :: <db.find.failed>]`, `Scale with id ${id} was not found`)
      return callback({ code: statusCode.NOT_FOUND, message: `Scale with id ${id} was not found` }, null)
    }

    const scale = parseMongoDocumentToJSO(scaleDoc)
    const value = { scale }

    Log.debug(`Request @ ${call.getPath()}`, { id })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  getScales: async (call, callback) => { // TODO: changed: Scales, scaleDoc, scales
    Log.info('gRPC @', call.getPath())
    
    const query = parseProtoToMongoFilter(call.request.filter)
    const sort = parseProtoToMongoSort(call.request.orderBy)
    const limit = parseProtoToMongoLimit(call.request.pageSize)
    const skip = parseProtoToMongoSkip(call.request.pageToken, limit)

    const totalCount = await Scales.countDocuments()
    const unpaginatedQuery = await Scales.find(query).sort(sort)
    const [paginationError, { nextPageToken, totalPages }] = getProtoPaginationData(limit, skip, unpaginatedQuery.length)

    const scaleDocs = await Scales.find(query).sort(sort).limit(limit).skip(paginationError ? 0 : skip).exec()
    const scales = scaleDocs.map(parseMongoDocumentToJSO)
    const value = { scales, totalCount, nextPageToken, totalPages }

    Log.debug(`Request @ ${call.getPath()}`, { query, sort, limit, skip })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  addScale: async (call, callback) => { // TODO: changed: scaleToInsert, if (!('name' in noteToInsert))..., Scale, scaleDocs, Scales, scaleDoc, scale
    Log.info('gRPC @', call.getPath())
    
    const scaleToInsert = call.request

    if (!('name' in scaleToInsert) || !('steps' in scaleToInsert)) { // TODO: needs a better way to check it
      Log.error(`[400 :: <param.schema.failed>]`, `Scale is missing 'name' or 'steps' property`, scaleToInsert)
      return callback({ code: statusCode.INVALID_ARGUMENT, message: `Scale is missing 'name' or 'steps' property` }, null)
    }

    const scaleDocs = await Scales.insertMany([scaleToInsert])
    const scaleDoc = scaleDocs?.[0] ?? null

    if (scaleDoc === null) {
      Log.error(`[500 :: <db.insert.failed>]`, `Scale has not been returned after 'insertMany' call - result array is empty`)
      return callback({ code: statusCode.UNKNOWN }, null)
    }

    const scale = parseMongoDocumentToJSO(scaleDoc)
    const value = { scale }

    Log.debug(`Request @ ${call.getPath()}`, scaleToInsert)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  updateScale: async (call, callback) => { // TODO: changed: scaleDoc, Scales, Scale, scale
    Log.info('gRPC @', call.getPath())
    
    const { id, ...params } = call.request
    const scaleDoc = await Scales.findById(id)

    if (scaleDoc === null) {
      Log.error(`[404 :: <db.find.failed>]`, `Scale with id ${id} was not found`)
      return callback({ code: statusCode.NOT_FOUND, message: `Scale with id ${id} was not found` }, null)
    }

    for (const [key, val] of Object.entries(scaleDoc.toObject())) {
      if (key === '_id')
        continue

      if (key in params) {
        const newVal: typeof val = params[key as keyof typeof params] || val
        scaleDoc.set(key, newVal)
      }
    }

    try {
      await scaleDoc.save() // done this way to get validation, as per docs: https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
    }
    catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        Log.error(`[400 :: <db.validation.failed>]`, err.message)
        return callback({ code: statusCode.INVALID_ARGUMENT, message: err.message }, null)
      } 
      else throw err
    }
    
    const scale = parseMongoDocumentToJSO(scaleDoc)
    const value = { scale }

    Log.debug(`Request @ ${call.getPath()}`, { id, ...params })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  deleteScale: async (call, callback) => { // TODO: changed: Scales, scale
    Log.info('gRPC @', call.getPath())
    
    const [idError, id] = parseProtoToMongoId(call.request.id)

    if (idError !== null) {
      Log.error(`[400 :: <param.schema.failed>]`, idError)
      return callback({ code: statusCode.INVALID_ARGUMENT, message: idError }, null)
    }

    const { deletedCount } = await Scales.deleteOne({ _id: id }).exec()

    if (deletedCount !== 1) {
      Log.error(`[500 :: <db.delete.failed>]`, `Encountered issues when deleting scale with id ${id}`, { deletedCount })
      return callback({ code: statusCode.UNKNOWN, message: `Encountered issues when deleting scale with id ${id}` }, null)
    }

    const value = { id: id.toString() }

    Log.debug(`Request @ ${call.getPath()}`, { id })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
}
