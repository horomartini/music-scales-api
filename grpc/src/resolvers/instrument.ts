import type { InstrumentServiceServer } from '../proto/generated/instrument'

export const instrumentService: InstrumentServiceServer = {
  getInstrument: (call, callback) => {
    console.log('getNote', call)
    callback(null, { instrument: { id: '1', name: 'test', defaultTuning: undefined } })
  },
  getInstruments: (call, callback) => {
    console.log('getNotes', call)
    callback(null, { instruments: [{ id: '1', name: 'test', defaultTuning: undefined }], totalCount: 1, nextPageToken: '', totalPages: 1 })
  }
}
