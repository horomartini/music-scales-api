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
} from '../proto/__generated__/note'
import { 
  GetNotesRequest, 
  GetNoteRequest, 
  AddNoteRequest, 
  UpdateNoteRequest, 
  DeleteNoteRequest, 
  NoteServiceClient, 
} from '../proto/__generated__/note'

import type { 
  GetInstrumentRequest as GetInstrumentRequestType, 
  GetInstrumentResponse, 
  GetInstrumentsRequest as GetInstrumentsRequestType, 
  GetInstrumentsResponse, 
  AddInstrumentRequest as AddInstrumentRequestType, 
  AddInstrumentResponse, 
  UpdateInstrumentRequest as UpdateInstrumentRequestType, 
  UpdateInstrumentResponse, 
  DeleteInstrumentRequest as DeleteInstrumentRequestType, 
  DeleteInstrumentResponse, 
} from '../proto/__generated__/instrument'
import { 
  GetInstrumentRequest, 
  GetInstrumentsRequest, 
  AddInstrumentRequest, 
  UpdateInstrumentRequest, 
  DeleteInstrumentRequest, 
  InstrumentServiceClient, 
} from '../proto/__generated__/instrument'

import type { 
  GetTuningRequest as GetTuningRequestType, 
  GetTuningResponse, 
  GetTuningsRequest as GetTuningsRequestType, 
  GetTuningsResponse, 
  AddTuningRequest as AddTuningRequestType, 
  AddTuningResponse, 
  UpdateTuningRequest as UpdateTuningRequestType, 
  UpdateTuningResponse, 
  DeleteTuningRequest as DeleteTuningRequestType, 
  DeleteTuningResponse, 
} from '../proto/__generated__/tuning'
import { 
  GetTuningRequest, 
  GetTuningsRequest, 
  AddTuningRequest, 
  UpdateTuningRequest, 
  DeleteTuningRequest, 
  TuningServiceClient, 
} from '../proto/__generated__/tuning'

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
} from '../proto/__generated__/scale'
import {
  GetScaleRequest, 
  GetScalesRequest, 
  AddScaleRequest, 
  UpdateScaleRequest, 
  DeleteScaleRequest,  
  ScaleServiceClient, 
} from '../proto/__generated__/scale'

import Log from '@shared/logger'


const IP = process.env.IP || 'localhost'
const PORT = process.env.PORT || 8084

const client = {
  note: new NoteServiceClient(`${IP}:${PORT}`, grpc.credentials.createInsecure()),
  instrument: new InstrumentServiceClient(`${IP}:${PORT}`, grpc.credentials.createInsecure()),
  tuning: new TuningServiceClient(`${IP}:${PORT}`, grpc.credentials.createInsecure()),
  scale: new ScaleServiceClient(`${IP}:${PORT}`, grpc.credentials.createInsecure()),
}

testRPC()

async function testRPC() {
  const noteService = async () => {
    try {
      const getNotesResponse: GetNotesResponse = await new Promise((resolve, reject) => {
        const request: GetNotesRequestType = GetNotesRequest.create({})
        client.note.getNotes(request, (err: grpc.ServiceError | null, response: GetNotesResponse) => {
          if (err)
            return reject(err)

          Log.info('NoteService GetNotesResponse successful')
          return resolve(response)
        })
      })

      await new Promise((resolve, reject) => {
        if (getNotesResponse.notes.at(0)?.id === undefined)
          return reject(new Error('GetNotesResponse returned array of empty objects'))

        const request: GetNoteRequestType = GetNoteRequest.create({ id: getNotesResponse.notes.at(0)!.id })
        client.note.getNote(request, (err: grpc.ServiceError | null, response: GetNoteResponse) => {
          if (err)
            return reject(err)

          Log.info('NoteService GetNoteResponse successful')
          return resolve(response)
        })
      })

      const addNoteResponse: AddNoteResponse = await new Promise((resolve, reject) => {
        const request: AddNoteRequestType = AddNoteRequest.create({ name: 'test' })
        client.note.addNote(request, (err: grpc.ServiceError | null, response: AddNoteResponse) => {
          if (err)
            return reject(err)

          Log.info('NoteService AddNoteResponse successful')
          return resolve(response)
        })
      })

      await new Promise((resolve, reject) => {
        if (addNoteResponse.note?.id === undefined)
          return reject(new Error('AddNoteResponse returned empty object'))

        const request: UpdateNoteRequestType = UpdateNoteRequest.create({ id: addNoteResponse.note!.id, name: 'test-updated' })
        client.note.updateNote(request, (err: grpc.ServiceError | null, response: UpdateNoteResponse) => {
          if (err)
            return reject(err)

          Log.info('NoteService UpdateNoteResponse successful')
          return resolve(response)
        })
      })

      await new Promise((resolve, reject) => {
        if (addNoteResponse.note?.id === undefined)
          return reject(new Error('AddNoteResponse returned empty object'))

        const request: DeleteNoteRequestType = DeleteNoteRequest.create({ id: addNoteResponse.note!.id })
        client.note.deleteNote(request, (err: grpc.ServiceError | null, response: DeleteNoteResponse) => {
          if (err)
            return reject(err)

          Log.info('NoteService DeleteNoteResponse successful')
          return resolve(response)
        })
      })
    }
    catch (err) {
      Log.error('NoteService', err)
    }
  }

  const instrumentService = async () => {
    try {
      const getInstrumentsResponse: GetInstrumentsResponse = await new Promise((resolve, reject) => {
        const request: GetInstrumentsRequestType = GetInstrumentsRequest.create({})
        client.instrument.getInstruments(request, (err: grpc.ServiceError | null, response: GetInstrumentsResponse) => {
          if (err)
            return reject(err)

          Log.info('InstrumentService GetInstrumentsResponse successful')
          return resolve(response)
        })
      })

      await new Promise((resolve, reject) => {
        if (getInstrumentsResponse.instruments.at(0)?.id === undefined)
          return reject(new Error('GetInstrumentsResponse returned array of empty objects'))

        const request: GetInstrumentRequestType = GetInstrumentRequest.create({ id: getInstrumentsResponse.instruments.at(0)!.id })
        client.instrument.getInstrument(request, (err: grpc.ServiceError | null, response: GetInstrumentResponse) => {
          if (err)
            return reject(err)

          Log.info('InstrumentService GetInstrumentResponse successful')
          return resolve(response)
        })
      })

      const addInstrumentResponse: AddInstrumentResponse = await new Promise((resolve, reject) => {
        const request: AddInstrumentRequestType = AddInstrumentRequest.create({ name: 'test' })
        client.instrument.addInstrument(request, (err: grpc.ServiceError | null, response: AddInstrumentResponse) => {
          if (err)
            return reject(err)

          Log.info('NInstrumentService AddInstrumentResponse successful')
          return resolve(response)
        })
      })

      await new Promise((resolve, reject) => {
        if (addInstrumentResponse.instrument?.id === undefined)
          return reject(new Error('AddInstrumentResponse returned empty object'))

        const request: UpdateInstrumentRequestType = UpdateInstrumentRequest.create({ id: addInstrumentResponse.instrument!.id, name: 'test-updated' })
        client.instrument.updateInstrument(request, (err: grpc.ServiceError | null, response: UpdateInstrumentResponse) => {
          if (err)
            return reject(err)

          Log.info('InstrumentService UpdateInstrumentResponse successful')
          return resolve(response)
        })
      })

      await new Promise((resolve, reject) => {
        if (addInstrumentResponse.instrument?.id === undefined)
          return reject(new Error('AddInstrumentResponse returned empty object'))

        const request: DeleteInstrumentRequestType = DeleteInstrumentRequest.create({ id: addInstrumentResponse.instrument!.id })
        client.instrument.deleteInstrument(request, (err: grpc.ServiceError | null, response: DeleteInstrumentResponse) => {
          if (err)
            return reject(err)

          Log.info('InstrumentService DeleteInstrumentResponse successful')
          return resolve(response)
        })
      })
    }
    catch (err) {
      Log.error('NoteService', err)
    }
  }

  await noteService()
  await instrumentService()
}


/*
// const client = new NoteServiceClient(`${IP}:${PORT}`, grpc.credentials.createInsecure())
// const client = new InstrumentServiceClient(`${IP}:${PORT}`, grpc.credentials.createInsecure())
// const client = new TuningServiceClient(`${IP}:${PORT}`, grpc.credentials.createInsecure())
// const client = new ScaleServiceClient(`${IP}:${PORT}`, grpc.credentials.createInsecure())
*/

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

/* // InstrumentService
// const request1: GetInstrumentsRequestType = GetInstrumentsRequest.create({})
// client.getInstruments(request1, (err: grpc.ServiceError | null, response: GetInstrumentsResponse) => {
//   console.log(err, response)
// })

// const request2: GetInstrumentRequestType = GetInstrumentRequest.create({ id: '6776fea8d1ed1c77d5e94976' })
// client.getInstrument(request2, (err: grpc.ServiceError | null, response: GetInstrumentResponse) => {
//   console.log(err, response)
// })

// const request3: AddInstrumentRequestType = AddInstrumentRequest.create({ name: 'violin', defaultTuningId: '6776fea8d1ed1c77d5e94977' })
// client.addInstrument(request3, (err: grpc.ServiceError | null, response: AddInstrumentResponse) => {
//   console.log(err, response)
// })

// const request4: UpdateInstrumentRequestType = UpdateInstrumentRequest.create({ id: '677798461ec523b95eeee992', name: 'viola' })
// client.updateInstrument(request4, (err: grpc.ServiceError | null, response: UpdateInstrumentResponse) => {
//   console.log(err, response)
// })

// const request5: DeleteInstrumentRequestType = DeleteInstrumentRequest.create({ id: '677798461ec523b95eeee992' })
// client.deleteInstrument(request5, (err: grpc.ServiceError | null, response: DeleteInstrumentResponse) => {
//   console.log(err, response)
// })
*/

/* // TuningService
// const request1: GetTuningsRequestType = GetTuningsRequest.create({})
// client.getTunings(request1, (err: grpc.ServiceError | null, response: GetTuningsResponse) => {
//   console.log(err, response)
// })

// const request2: GetTuningRequestType = GetTuningRequest.create({ id: '6776fea8d1ed1c77d5e94977' })
// client.getTuning(request2, (err: grpc.ServiceError | null, response: GetTuningResponse) => {
//   console.log(err, response)
// })

// const request3: AddTuningRequestType = AddTuningRequest.create({ name: 'Drop D', notes: [{ octave: -1 }, {}] })
// client.addTuning(request3, (err: grpc.ServiceError | null, response: AddTuningResponse) => {
//   console.log(err, response)
// })

// const request4: UpdateTuningRequestType = UpdateTuningRequest.create({ id: '6777b10d569d866d57ff76dc', name: 'Trash Tuning' })
// client.updateTuning(request4, (err: grpc.ServiceError | null, response: UpdateTuningResponse) => {
//   console.log(err, response)
// })

// const request5: DeleteTuningRequestType = DeleteTuningRequest.create({ id: '6777b23c5b1282d42a7611b7' })
// client.deleteTuning(request5, (err: grpc.ServiceError | null, response: DeleteTuningResponse) => {
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
