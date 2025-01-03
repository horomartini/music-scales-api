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

import type {
  GetScaleRequest as GetScaleRequestType, 
  GetScaleResponse, 
  GetScalesRequest as GetScalesRequestType, 
  GetScalesResponse, 
  AddScaleRequest as AddScaleRequestType, 
  AddScaleResponse, 
  UpdateScaleRequest as UpdateScaleRequestType, 
  UpdateScaleResponse, 
  DeleteScaleRequest as DeleteScaleRequestType, 
  DeleteScaleResponse, 
} from 'proto/generated/scale'
import {
  GetScaleRequest, 
  GetScalesRequest, 
  AddScaleRequest, 
  UpdateScaleRequest, 
  DeleteScaleRequest,  
  ScaleServiceClient, 
} from 'proto/generated/scale'

const PORT = process.env.PORT || 8084


// const client = new NoteServiceClient(`localhost:${PORT}`, grpc.credentials.createInsecure())
const client = new ScaleServiceClient(`localhost:${PORT}`, grpc.credentials.createInsecure())

/* // NoteService
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
*/

/* // ScaleService
// const request1: GetScalesRequestType = GetScalesRequest.create({})
// client.getScales(request1, (err: grpc.ServiceError | null, response: GetScalesResponse) => {
//   console.log(err, response)
// })

// const request2: GetScaleRequestType = GetScaleRequest.create({ id: '6776fea8d1ed1c77d5e94978' })
// client.getScale(request2, (err: grpc.ServiceError | null, response: GetScaleResponse) => {
//   console.log(err, response)
// })

// const request3: AddScaleRequestType = AddScaleRequest.create({ name: 'test', steps: [] })
// client.addScale(request3, (err: grpc.ServiceError | null, response: AddScaleResponse) => {
//   console.log(err, response)
// })

// const request4: UpdateScaleRequestType = UpdateScaleRequest.create({ id: '67776655fe5fd6f9b5dde618', steps: [3, 3, 3, 3] })
// client.updateScale(request4, (err: grpc.ServiceError | null, response: UpdateScaleResponse) => {
//   console.log(err, response)
// })

// const request5: DeleteScaleRequestType = DeleteScaleRequest.create({ id: '67776655fe5fd6f9b5dde618' })
// client.deleteScale(request5, (err: grpc.ServiceError | null, response: DeleteScaleResponse) => {
//   console.log(err, response)
// })
*/

// // run with `node --inspect=0.0.0.0:9230 --nolazy -r ts-node/register -r tsconfig-paths/register src/client.ts`
// run with `node --nolazy -r ts-node/register -r tsconfig-paths/register src/client.ts`
