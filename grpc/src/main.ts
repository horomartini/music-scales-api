import * as grpc from '@grpc/grpc-js'

import { NoteServiceService } from './proto/__generated__/note'
import { InstrumentServiceService } from 'proto/__generated__/instrument'
import { TuningServiceService } from 'proto/__generated__/tuning'
import { ScaleServiceService } from 'proto/__generated__/scale'
import { noteService, instrumentService, tuningService, scaleService } from 'resolvers'

import mongoose from 'mongoose'

import Log from '@shared/logger'

import { isProd } from '@shared/env'


const IP = process.env.IP || '0.0.0.0'
const PORT = process.env.PORT || 4000
const NODE_ENV = process.env.NODE_ENV || ''
const MONGO_URI = process.env.MONGO_URI || undefined

Log.init(() => isProd(NODE_ENV))


const server = new grpc.Server()

server.addService(NoteServiceService, noteService)
server.addService(InstrumentServiceService, instrumentService)
server.addService(TuningServiceService, tuningService)
server.addService(ScaleServiceService, scaleService)

server.bindAsync(`${IP}:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  Log.info(`Service gRPC is running on ${IP}:${PORT}`)

  if (MONGO_URI === undefined)
    Log.warn('MONGO_URI has not been defined - connection to database will not be established')
  else
    mongoose
      .connect(MONGO_URI, {})
      .then(() => Log.info('MongoDB connection established with URI'))
      .catch(err => Log.error('Error connecting to MongoDB', err.message))
})
