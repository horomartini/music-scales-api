import type { GetRequestNotes, GetResponseNotes, GetRequestNote, GetResponseNote } from 'proto/note'

import * as grpc from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'


const PORT = process.env.PORT || 4000


const packageDefinition = loadSync('./src/proto/note.proto', { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
const protoNotes = grpc.loadPackageDefinition(packageDefinition).notes as any
const client = new protoNotes.NoteService(`localhost:${PORT}`, grpc.credentials.createInsecure())

client.GetNotes({}, (err: any, response: any) => {
  console.log(err, response)
})

// run with `node --inspect=0.0.0.0:9230 --nolazy -r ts-node/register src/client.ts`
