// import type { GetRequestNotes, GetResponseNotes, GetRequestNote, GetResponseNote } from '@proto/note'

import * as grpc from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'

import type { GetNotesRequest as GetNotesRequestType, GetNotesResponse } from 'proto/generated/note'
import { GetNotesRequest, NoteServiceClient } from 'proto/generated/note'


const PORT = process.env.PORT || 4000


// const packageDefinition = loadSync('./src/proto/note.proto', { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
// const protoNotes = grpc.loadPackageDefinition(packageDefinition).notes as any
// const client = new protoNotes.NoteService(`localhost:${PORT}`, grpc.credentials.createInsecure())

const client = new NoteServiceClient(`localhost:${PORT}`, grpc.credentials.createInsecure())

const request: GetNotesRequestType = GetNotesRequest.create({})

client.getNotes(request, (err: grpc.ServiceError | null, response: GetNotesResponse) => {
  console.log(err, response)
})

// run with `node --inspect=0.0.0.0:9230 --nolazy -r ts-node/register src/client.ts`
