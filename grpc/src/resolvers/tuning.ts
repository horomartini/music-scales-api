import type { TuningServiceServer } from '../proto/generated/tuning'

export const tuningService: TuningServiceServer = {
  getTuning: (call, callback) => {
    console.log('getNote', call)
    callback(null, { tuning: { id: '1', name: 'test', instrument: undefined, notes: [] } })
  },
  getTunings: (call, callback) => {
    console.log('getNotes', call)
    callback(null, { tunings: [{ id: '1', name: 'test', instrument: undefined, notes: [] }], totalCount: 1, nextPageToken: '', totalPages: 1 })
  }
}
