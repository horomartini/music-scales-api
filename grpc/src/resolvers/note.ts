import { noteCrud } from 'mongo/crud/notes'
import type { NoteServiceServer } from '../proto/generated/note'
import Log from '@shared/logger'

export const noteService: NoteServiceServer = {
  getNote: async (call, callback) => {
    Log.debug('getNote', call.request)

    const { id } = call.request
    const data = await noteCrud.getOne(id)

    callback(null, { note: data })
  },
  getNotes: async (call, callback) => {
    Log.debug('getNotes', call.request)

    const { filter, orderBy, pageSize, pageToken } = call.request
    const data = await noteCrud.getMany(filter, orderBy, pageSize || undefined, pageToken || undefined)

    callback(null, { notes: data, totalCount: 1, nextPageToken: '', totalPages: 1 })
  }
}
