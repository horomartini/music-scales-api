import * as grpc from '@grpc/grpc-js'

import type { 
  GetNoteRequest as GetNoteRequestType, 
  GetNoteResponse, 
  GetNotesRequest as GetNotesRequestType, 
  GetNotesResponse, 
  AddNoteRequest as AddNoteRequestType, 
  AddNoteResponse, 
  UpdateNoteRequest as UpdateNoteRequestType, 
  UpdateNoteResponse, 
  DeleteNoteRequest as DeleteNoteRequestType, 
  DeleteNoteResponse, 
} from 'proto/generated/note'
import { 
  GetNotesRequest, 
  GetNoteRequest, 
  AddNoteRequest, 
  UpdateNoteRequest, 
  DeleteNoteRequest, 
  NoteServiceClient, 
} from 'proto/generated/note'
import { parseProtoToMongoFilter } from './utils/filter'


const PORT = process.env.PORT || 8084


const client = new NoteServiceClient(`localhost:${PORT}`, grpc.credentials.createInsecure())


// const request1: GetNotesRequestType = GetNotesRequest.create({ filter: 'name = C', orderBy: 'name desc', pageSize: 5 })
// const request1: GetNotesRequestType = GetNotesRequest.create({})
// client.getNotes(request1, (err: grpc.ServiceError | null, response: GetNotesResponse) => {
//   console.log(err, response)
// })

// const request2: GetNoteRequestType = GetNoteRequest.create({ id: '3375' })
// client.getNote(request2, (err: grpc.ServiceError | null, response: GetNoteResponse) => {
//   console.log(err, response)
// })

// const request3: AddNoteRequestType = AddNoteRequest.create({ name: 'test1' })
// client.addNote(request3, (err: grpc.ServiceError | null, response: AddNoteResponse) => {
//   console.log(err, response)
// })

// const request4: UpdateNoteRequestType = UpdateNoteRequest.create({ id: '67772cc96df76ff6e51d0ed8', name: 'test1' })
// client.updateNote(request4, (err: grpc.ServiceError | null, response: UpdateNoteResponse) => {
//   console.log(err, response)
// })

// const request5: DeleteNoteRequestType = DeleteNoteRequest.create({ id: '67772cc96df76ff6e51d0ed8' })
// client.deleteNote(request5, (err: grpc.ServiceError | null, response: DeleteNoteResponse) => {
//   console.log(err, response)
// })

// run with `node --inspect=0.0.0.0:9230 --nolazy -r ts-node/register -r tsconfig-paths/register src/client.ts`
