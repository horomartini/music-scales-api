
import type { PhysicalNoteResolvers } from '../__generated__/types'

import Log from '@shared/logger'


const typeResolvers: PhysicalNoteResolvers = {
  note: async (parent, _, { grpc }) => {
    Log.info('Resolver.PhysicalNote.note')
    Log.debug('Request @ PhysicalNote.PhysicalNote', { parent })

    if (grpc.Note === undefined)
      return null

    const request = grpc.Note.req.get({ id: parent.note?.id })
    const response = await grpc.Note.get(request)

    return response.note ?? null
  }
}


export default {
  typeResolvers, 
}
