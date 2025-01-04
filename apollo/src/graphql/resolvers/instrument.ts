
import type { QueryResolvers, MutationResolvers, InstrumentResolvers, Note, Instrument, Tuning } from '../__generated__/types'

import { parseFilterToString, parseSortToString } from '../../utils'

import Log from '@shared/logger'


const queryResolvers: Pick<QueryResolvers, 'getInstrument' | 'getInstruments'> = {
  getInstrument: async (_, { id }, { grpc }) => {
    Log.info('Query.getInstrument')
    Log.debug('Request @ getInstrument', { id })

    if (grpc.Instrument === undefined)
      return null
      
    const request = grpc.Instrument.req.get({ id })
    const response = await grpc.Instrument.get(request)

    if (response.instrument === undefined)
      return null

    const mappedResponse: Instrument = {
      ...response.instrument,
      defaultTuning: { id: response.instrument.defaultTuningId || null } as Tuning,
    }

    return mappedResponse
  },
  getInstruments: async (_, { filter, sort, paginate }, { grpc }) => {
    Log.info('Query.getInstruments')
    Log.debug('Request @ getInstruments', { filter, sort, paginate })

    if (grpc.Instrument === undefined)
      return []
      
    const data = {
      filter: parseFilterToString(filter),
      orderBy: parseSortToString(sort),
    }
    const request = grpc.Instrument.req.getMany(data) // TODO: handle pagination
    const response = await grpc.Instrument.getMany(request)

    const mappedResponse: Instrument[] = response.instruments.map(obj => ({
      ...obj,
      defaultTuning: { id: obj.defaultTuningId || null } as Tuning,
    }))

    return mappedResponse
  },
}

const mutationResolvers: Pick<MutationResolvers, 'addInstrument' | 'updateInstrument' | 'deleteInstrument'> = {
  addInstrument: async (_, { input }, { grpc }) => {
    Log.info('Mutation.addInstrument')
    Log.debug('Request @ addInstrument', { input })

    if (grpc.Instrument === undefined)
      return null

    const data = Object
      .entries(input ?? {})
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val ?? undefined }), {})
    const request = grpc.Instrument.req.add(data)
    const response = await grpc.Instrument.add(request)

    if (response.instrument === undefined)
      return null

    const mappedResponse: Instrument = {
      ...response.instrument,
      defaultTuning: { id: response.instrument.defaultTuningId || null } as Tuning,
    }

    return mappedResponse
  },
  updateInstrument: async (_, { id, input }, { grpc }) => {
    Log.info('Mutation.updateInstrument')
    Log.debug('Request @ updateInstrument', { id, input })

    if (grpc.Instrument === undefined)
      return null

    const data = Object
      .entries(input ?? {})
      .reduce((acc, [key, val]) => ({ ...acc, [key]: val ?? undefined }), {})
    const request = grpc.Instrument.req.update({ id, ...data })
    const response = await grpc.Instrument.update(request)

    if (response.instrument === undefined)
      return null

    const mappedResponse: Instrument = {
      ...response.instrument,
      defaultTuning: { id: response.instrument.defaultTuningId || null } as Tuning,
    }

    return mappedResponse
  },
  deleteInstrument: async (_, { id }, { grpc }) => {
    Log.info('Mutation.deleteInstrument')
    Log.debug('Request @ deleteInstrument', { id })

    if (grpc.Instrument === undefined)
      return null

    const request = grpc.Instrument.req.delete({ id })
    const response = await grpc.Instrument.delete(request)

    return response.id ?? null
  },
}

const typeResolvers: InstrumentResolvers = {
  defaultTuning: async (parent, _, context) => {
    Log.info('Resolver.Instrument.defaultTuning')
    Log.debug('Request @ Instrument.defaultTuning', { parent })

    if (context.grpc.Tuning === undefined)
      return null
      
    const request = context.grpc.Tuning.req.get({ id: parent.defaultTuning?.id })
    const response = await context.grpc.Tuning.get(request)

    if (response.tuning === undefined)
      return null

    const mappedResponse: Tuning = {
      ...response.tuning,
      instrument: { id: response.tuning.instrumentId || null } as Instrument,
      notes: response.tuning.notes.map(obj => ({ ...obj, note: { id: obj.noteId || null } as Note }))
    }

    return mappedResponse
  }
}


export default {
  queryResolvers, 
  mutationResolvers, 
  typeResolvers, 
}
