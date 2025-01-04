
import type { QueryResolvers, MutationResolvers, TuningResolvers, Note, Instrument, Tuning } from '../__generated__/types'

import { parseFilterToString, parseSortToString } from '../../utils'

import Log from '@shared/logger'


const queryResolvers: Pick<QueryResolvers, 'getTuning' | 'getTunings'> = {
  getTuning: async (_, { id }, { grpc }) => {
    Log.info('Query.getTuning')
    Log.debug('Request @ getTuning', { id })

    if (grpc.Tuning === undefined)
      return null
      
    const request = grpc.Tuning.req.get({ id })
    const response = await grpc.Tuning.get(request)

    if (response.tuning === undefined)
      return null

    const mappedResponse: Tuning = {
      ...response.tuning,
      instrument: { id: response.tuning.instrumentId || null } as Instrument,
      notes: response.tuning.notes.map(obj => ({ ...obj, note: { id: obj.noteId || null } as Note }))
    }

    return mappedResponse
  },
  getTunings: async (_, { filter, sort, paginate }, { grpc }) => {
    Log.info('Query.getTunings')
    Log.debug('Request @ getTunings', { filter, sort, paginate })

    if (grpc.Tuning === undefined)
      return []
      
    const data = {
      filter: parseFilterToString(filter),
      orderBy: parseSortToString(sort),
    }
    const request = grpc.Tuning.req.getMany(data) // TODO: handle pagination
    const response = await grpc.Tuning.getMany(request)

    const mappedResponse: Tuning[] = response.tunings.map(obj => ({
      ...obj,
      instrument: { id: obj.instrumentId || null } as Instrument,
      notes: obj.notes.map(obj2 => ({ ...obj2, note: { id: obj2.noteId || null } as Note }))
    }))

    return mappedResponse
  },
}

const mutationResolvers: Pick<MutationResolvers, 'addTuning' | 'updateTuning' | 'deleteTuning'> = {
  addTuning: async (_, { input }, { grpc }) => {
    Log.info('Mutation.addTuning')
    Log.debug('Request @ addTuning', { input })

    if (grpc.Tuning === undefined)
      return null

    const data = Object
      .entries(input ?? {})
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val ?? undefined }), {})
    const request = grpc.Tuning.req.add(data)
    const response = await grpc.Tuning.add(request)

    if (response.tuning === undefined)
      return null

    const mappedResponse: Tuning = {
      ...response.tuning,
      instrument: { id: response.tuning.instrumentId || null } as Instrument,
      notes: response.tuning.notes.map(obj => ({ ...obj, note: { id: obj.noteId || null } as Note }))
    }

    return mappedResponse
  },
  updateTuning: async (_, { id, input }, { grpc }) => {
    Log.info('Mutation.updateTuning')
    Log.debug('Request @ updateTuning', { id, input })

    if (grpc.Tuning === undefined)
      return null

    const data = Object
      .entries(input ?? {})
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val ?? undefined }), {})
    const request = grpc.Tuning.req.update({ id, ...data })
    const response = await grpc.Tuning.update(request)

    if (response.tuning === undefined)
      return null

    const mappedResponse: Tuning = {
      ...response.tuning,
      instrument: { id: response.tuning.instrumentId || null } as Instrument,
      notes: response.tuning.notes.map(obj => ({ ...obj, note: { id: obj.noteId || null } as Note }))
    }

    return mappedResponse
  },
  deleteTuning: async (_, { id }, { grpc }) => {
    Log.info('Mutation.deleteTuning')
    Log.debug('Request @ deleteTuning', { id })

    if (grpc.Tuning === undefined)
      return null

    const request = grpc.Tuning.req.delete({ id })
    const response = await grpc.Tuning.delete(request)

    return response.id ?? null
  },
}

const typeResolvers: TuningResolvers = {
  instrument: async (parent, _, { grpc }) => {
    Log.info('Resolver.Tuning.instrument')
    Log.debug('Request @ Tuning.instrument', { parent })

    if (grpc.Instrument === undefined) 
      return null

    const request = grpc.Instrument.req.get({ id: parent.instrument?.id })
    const response = await grpc.Instrument.get(request)
    
    if (response.instrument === undefined)
      return null

    const mappedResponse: Instrument = {
      ...response.instrument,
      defaultTuning: { id: response.instrument.defaultTuningId || null } as Tuning,
    }

    return mappedResponse
  }
}


export default {
  queryResolvers, 
  mutationResolvers, 
  typeResolvers, 
}
