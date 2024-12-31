import type { Document, Model } from 'mongoose'
import type { GetRequestNotes, GetResponseNotes, GetRequestNote, GetResponseNote } from "@proto/note"

import * as grpc from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import mongoose from 'mongoose'


const PORT = process.env.PORT || 4000

const packageDefinition = loadSync('./src/proto/note.proto', { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
const protoNotes = grpc.loadPackageDefinition(packageDefinition).notes as any


const server = new grpc.Server()

server.addService(protoNotes.NoteService.service, { 
  getNote: (call: grpc.ServerUnaryCall<GetRequestNote, GetResponseNote>, callback: grpc.sendUnaryData<GetResponseNote>) => {
    console.log('getNote', call)
    callback(null, { note: { id: '1', name: 'test' } })
  },
  getNotes: (call: grpc.ServerUnaryCall<GetRequestNotes, GetResponseNotes>, callback: grpc.sendUnaryData<GetResponseNotes>) => {
    console.log('getNotes', call)
    callback(null, { notes: [{ id: '1', name: 'test' }], total: 1 })
  },
})

server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.info('grpc started') 
})