import * as grpc from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'

import type { GetNotesRequest as GetNotesRequestType, GetNotesResponse } from 'proto/generated/note'
import { GetNotesRequest, NoteServiceClient } from 'proto/generated/note'
import { parseProtoToMongoFilter } from './utils/filter'


const PORT = process.env.PORT || 4000


const client = new NoteServiceClient(`localhost:${PORT}`, grpc.credentials.createInsecure())

const request: GetNotesRequestType = GetNotesRequest.create({})

client.getNotes(request, (err: grpc.ServiceError | null, response: GetNotesResponse) => {
  console.log(err, response)
})

// run with `node --inspect=0.0.0.0:9230 --nolazy -r ts-node/register -r tsconfig-paths/register src/client.ts`
