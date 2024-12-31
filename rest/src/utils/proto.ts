import type { NoteDoc } from 'types/db'
import type { GetRequestNote, GetResponseNote } from '@proto/note'

import * as protoLoader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'

import { stringToObjectId } from './types'


const packageDefinition = protoLoader.loadSync('./src/proto/note.proto', { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
const protoDefinition = grpc.loadPackageDefinition(packageDefinition)

const grpcClient = { // TODO: bad `any` and static ip and port for grpc need to go
  note: new (protoDefinition.notes as any).NoteService('localhost:4000', grpc.credentials.createInsecure())
}

export const grpcCustomClient = {
  note: {
    getOne: async (data: Partial<NoteDoc>): Promise<NoteDoc | null> => new Promise((resolve, reject) => {
      if (data?._id === undefined)
        return reject('no _id')

      const noteRequest: GetRequestNote = { id: data._id.toString() }

      grpcClient.note.GetNote(noteRequest, (err: any, response: GetResponseNote) => {
        if (err !== undefined)
          return reject(err)

        if (response.note === undefined)
          return resolve(null)

        const noteResponse: NoteDoc = { _id: stringToObjectId(response.note.id), name: response.note.name } as NoteDoc
      
        return resolve(noteResponse)
      })
    })
  }
}

export default grpcClient
