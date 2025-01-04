
import type { QueryResolvers, MutationResolvers } from '../__generated__/types'

import { parseFilterToString, parseSortToString } from '../../utils'

import Log from '@shared/logger'


const queryResolvers: Pick<QueryResolvers, 'getScale' | 'getScales'> = {
  getScale: async (_, { id }, { grpc }) => {
    Log.info('Query.getScale')
    Log.debug('Request @ getScale', { id })

    if (grpc.Scale === undefined)
      return null
      
    const request = grpc.Scale.req.get({ id })
    const response = await grpc.Scale.get(request)

    return response.scale ?? null
  },
  getScales: async (_, { filter, sort, paginate }, { grpc }) => {
    Log.info('Query.getScales')
    Log.debug('Request @ getScales', { filter, sort, paginate })

    if (grpc.Scale === undefined)
      return []
      
    const data = {
      filter: parseFilterToString(filter),
      orderBy: parseSortToString(sort),
    }
    const request = grpc.Scale.req.getMany(data) // TODO: handle pagination
    const response = await grpc.Scale.getMany(request)

    return response.scales
  },
}

const mutationResolvers: Pick<MutationResolvers, 'addScale' | 'updateScale' | 'deleteScale'> = {
  addScale: async (_, { input }, { grpc }) => {
    Log.info('Mutation.addScale')
    Log.debug('Request @ addScale', { input })

    if (grpc.Scale === undefined)
      return null

    const request = grpc.Scale.req.add(input)
    const response = await grpc.Scale.add(request)

    return response.scale ?? null
  },
  updateScale: async (_, { id, input }, { grpc }) => {
    Log.info('Mutation.updateScale')
    Log.debug('Request @ updateScale', { id, input })

    if (grpc.Scale === undefined)
      return null

    const data = Object
      .entries(input ?? {})
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val ?? undefined }), {})
    const request = grpc.Scale.req.update({ id, ...data })
    const response = await grpc.Scale.update(request)

    return response.scale ?? null
  },
  deleteScale: async (_, { id }, { grpc }) => {
    Log.info('Mutation.deleteScale')
    Log.debug('Request @ deleteScale', { id })

    if (grpc.Scale === undefined)
      return null

    const request = grpc.Scale.req.delete({ id })
    const response = await grpc.Scale.delete(request)

    return response.id ?? null
  },
}


export default {
  queryResolvers, 
  mutationResolvers, 
}
