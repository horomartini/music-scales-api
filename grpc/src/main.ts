import * as grpc from '@grpc/grpc-js'

import { NoteServiceService } from './proto/generated/note'
import { noteService } from 'resolvers'

import mongoose from 'mongoose'

import Log from '@shared/logger'


const IP = process.env.IP || '0.0.0.0'
const PORT = process.env.PORT || 4000
const NODE_ENV = process.env.NODE_ENV || ''
const MONGO_URI = process.env.MONGO_URI || undefined

Log.init(() => ['prod', 'production'].includes(NODE_ENV))


const server = new grpc.Server()

server.addService(NoteServiceService, noteService)
server.bindAsync(`${IP}:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  Log.info(`Service gRPC is running on ${IP}:${PORT}`)

  if (MONGO_URI === undefined)
    Log.warn('MONG_URI has not been defined - connection to database will not be established')
  else
    mongoose
      .connect(MONGO_URI, {})
      .then(() => Log.info('Connected to MongoDB succesfully'))
      .catch(err => Log.error('Error connecting to MongoDB', err.message))
})