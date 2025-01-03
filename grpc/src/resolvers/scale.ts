import type { ScaleServiceServer } from '../proto/generated/scale'
import type { ScaleDoc } from 'types/db'

import mongoose from 'mongoose'

import { status as statusCode } from '@grpc/grpc-js'

import { Scales } from '../mongo/model'
import {
  parseProtoToMongoFilter,
  parseProtoToMongoSort,
  parseProtoToMongoLimit,
  parseProtoToMongoSkip,
  getProtoPaginationData,
} from '../utils'

import Log from '@shared/logger'


export const scaleService: ScaleServiceServer = {
  getScale: async (call, callback) => {
    Log.info('gRPC @', call.getPath())
    
    const { id } = call.request
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const scaleDoc = await Scales.findById(id).exec()

    if (scaleDoc === null) {
      const message = `Scale with id ${id} was not found`
      Log.error(`[404 :: <db.find.failed>]`, message)
      return callback({ code: statusCode.NOT_FOUND, message }, null)
    }

    const scale = {
      id: scaleDoc._id.toString(),
      name: scaleDoc.name,
      steps: scaleDoc.steps,
    }
    const value = { scale }

    Log.debug(`Request @ ${call.getPath()}`, call.request)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  getScales: async (call, callback) => {
    Log.info('gRPC @', call.getPath())
    
    const query = parseProtoToMongoFilter(call.request.filter)
    const sort = parseProtoToMongoSort(call.request.orderBy)
    const limit = parseProtoToMongoLimit(call.request.pageSize)
    const skip = parseProtoToMongoSkip(call.request.pageToken, limit)

    const totalCount = await Scales.countDocuments()
    const unpaginatedQuery = await Scales.find(query).sort(sort)
    const [paginationError, { nextPageToken, totalPages }] = getProtoPaginationData(limit, skip, unpaginatedQuery.length)

    const scaleDocs = await Scales.find(query).sort(sort).limit(limit).skip(paginationError ? 0 : skip).exec()
    const scales = scaleDocs.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      steps: doc.steps,
    }))
    const value = { scales, totalCount, nextPageToken, totalPages }

    Log.debug(`Request @ ${call.getPath()}`, call.request, { query, sort, limit, skip })
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  addScale: async (call, callback) => {
    Log.info('gRPC @', call.getPath())
    
    const { name, steps } = call.request

    if (name === '') {
      const message = `Scale is missing required property: name`
      Log.error(`[400 :: <param.schema.failed>]`, message, call.request)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    if (steps.length === 0) {
      const message = `Scale is missing required property: steps`
      Log.error(`[400 :: <param.schema.failed>]`, message, call.request)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const scaleToInsert: Omit<ScaleDoc, '_id'> = {
      name: name,
      steps: steps,
    }

    const scaleDocs = await Scales.insertMany([scaleToInsert]) // TODO: replace with doc.save()
    const scaleDoc = scaleDocs?.[0] ?? null

    if (scaleDoc === null) {
      const message = `Scale has not been returned after 'insertMany' call - result array is empty`
      Log.error(`[500 :: <db.insert.failed>]`, message, scaleDocs)
      return callback({ code: statusCode.UNKNOWN }, null)
    }

    const scale = {
      id: scaleDoc._id.toString(),
      name: scaleDoc.name,
      steps: scaleDoc.steps,
    }
    const value = { scale }

    Log.debug(`Request @ ${call.getPath()}`, call.request, scaleToInsert)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  updateScale: async (call, callback) => {
    Log.info('gRPC @', call.getPath())
    
    const { id, ...fields } = call.request

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const scaleDoc = await Scales.findById(id)

    if (scaleDoc === null) {
      const message = `Scale with id ${id} was not found`
      Log.error(`[404 :: <db.find.failed>]`, message)
      return callback({ code: statusCode.NOT_FOUND, message }, null)
    }

    for (const [key, val] of Object.entries(scaleDoc.toObject())) {
      if (key === '_id')
        continue

      if (key in fields) {
        const newVal = fields[key as keyof typeof fields] || val
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
    
    const scale = {
      id: scaleDoc._id.toString(),
      name: scaleDoc.name,
      steps: scaleDoc.steps,
    }
    const value = { scale }

    Log.debug(`Request @ ${call.getPath()}`, call.request)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
  deleteScale: async (call, callback) => {
    Log.info('gRPC @', call.getPath())
    
    const { id } = call.request
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const message = `Id ${id} is not a valid ObjectId`
      Log.error(`[400 :: <param.schema.failed>]`, message)
      return callback({ code: statusCode.INVALID_ARGUMENT, message }, null)
    }

    const { deletedCount } = await Scales.deleteOne({ _id: id }).exec()

    if (deletedCount !== 1) {
      const message = `Encountered issue when deleting scale with id ${id} - deletedCount !== 1`
      Log.error(`[500 :: <db.delete.failed>]`, message)
      return callback({ code: statusCode.UNKNOWN }, null)
    }

    const value = { id: id.toString() }

    Log.debug(`Request @ ${call.getPath()}`, call.request)
    Log.debug(`Response @ ${call.getPath()}`, value)

    callback(null, value)
  },
}
