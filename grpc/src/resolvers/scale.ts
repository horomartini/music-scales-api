import type { ScaleServiceServer } from '../proto/generated/scale'

export const scaleService: ScaleServiceServer = {
  getScale: (call, callback) => {
    console.log('getNote', call)
    callback(null, { scale: { id: '1', name: 'test', steps: [] } })
  },
  getScales: (call, callback) => {
    console.log('getNotes', call)
    callback(null, { scales: [{ id: '1', name: 'test', steps: [] }], totalCount: 1, nextPageToken: '', totalPages: 1 })
  }
}
