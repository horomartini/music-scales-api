
import type { QueryResolvers, MutationResolvers } from '../__generated__/types'

import { parseFilterToString, parseSortToString } from '../../utils'

import Log from '@shared/logger'


const queryResolvers: Pick<QueryResolvers, 'getNote' | 'getNotes'> = {
  getNote: async (_, { id }, { grpc }) => {
    Log.info('Query.getNote')
    Log.debug('Request @ getNote', { id })

    if (grpc.Note === undefined)
      return null

    const request = grpc.Note.req.get({ id })
    const response = await grpc.Note.get(request)

    return response.note ?? null
  }, 
  getNotes: async (_, { filter, sort, paginate }, { grpc }) => {
    Log.info('Query.getNotes')
    Log.debug('Request @ getNotes', { filter, sort, paginate })

    if (grpc.Note === undefined)
      return []

    const data = {
      filter: parseFilterToString(filter),
      orderBy: parseSortToString(sort),
    }
    const request = grpc.Note.req.getMany(data) // TODO: handle pagination
    const response = await grpc.Note.getMany(request)

    return response.notes
  },
}

const mutationResolvers: Pick<MutationResolvers, 'addNote' | 'updateNote' | 'deleteNote'> = {
  addNote: async (_, { input }, { grpc }) => {
    Log.info('Mutation.addNote')
    Log.debug('Request @ addNote', { input })

    if (grpc.Note === undefined)
      return null

    const request = grpc.Note.req.add(input)
    const response = await grpc.Note.add(request)

    return response.note ?? null
  },
  updateNote: async (_, { id, input }, { grpc }) => {
    Log.info('Mutation.updateNote')
    Log.debug('Request @ updateNote', { id, input })

    if (grpc.Note === undefined)
      return null

    const data = Object
      .entries(input ?? {})
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val ?? undefined }), {})
    const request = grpc.Note.req.update({ id, ...data })
    const response = await grpc.Note.update(request)

    return response.note ?? null
  },
  deleteNote: async (_, { id }, { grpc }) => {
    Log.info('Mutation.deleteNote')
    Log.debug('Request @ deleteNote', { id })

    if (grpc.Note === undefined)
      return null

    const request = grpc.Note.req.delete({ id })
    const response = await grpc.Note.delete(request)

    return response.id ?? null
  },
}


export default {
  queryResolvers, 
  mutationResolvers, 
}
