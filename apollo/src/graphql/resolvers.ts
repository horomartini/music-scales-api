import { FilterOperator, type FilteringInput, type InputMaybe, type Instrument, type Note, type Resolvers, type SortingInput, type Tuning } from './__generated__/types'

import { variedPrimitiveScalar } from './scalars'


import Log from '@shared/logger'


const namedOpToSymbolOp = (op?: FilterOperator): string => {
  switch (op) {
    case FilterOperator.LessEquals: return '<='
    case FilterOperator.LessThan: return '<'
    case FilterOperator.GreaterEquals: return '>='
    case FilterOperator.GreaterThan: return '>'
    case FilterOperator.NotEquals: return '!='
    case FilterOperator.Equals: return '='
    default: throw new Error(`Unknown FilterOperator: ${op} - cannot parse to symbol`)
  }
}

const parseFilterToString = (filter: InputMaybe<FilteringInput> | undefined): string => {
  if (filter === null || filter === undefined)
    return ''

  if (filter?.singleFieldFilter !== undefined) {
    const field = filter.singleFieldFilter?.field ?? ''
    const operation = namedOpToSymbolOp(filter.singleFieldFilter?.operation)
    const value = filter.singleFieldFilter?.value ?? ''

    return `${field} ${operation.toUpperCase()} ${value}`
  }

  return filter?.withString ?? ''
}

const parseSortToString = (sort: InputMaybe<SortingInput> | undefined): string => {
  if (sort === null || sort === undefined)
    return ''

  if (sort?.singleFieldSort !== undefined) {
    const field = sort.singleFieldSort?.field ?? ''
    const order = sort.singleFieldSort?.order ?? ''

    return `${field} ${order.toLowerCase()}`
  }

  return sort?.withString ?? ''
}


export const resolvers: Resolvers = {
  Query: {
    getNote: async (_, { id }, { grpc }) => {
      Log.info('Query.getNote')
      Log.debug('Request @ getNote', { id })

      if (grpc.Note === undefined)
        return null

      const request = grpc.Note.req.get({ id: id ?? '' })
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
      const request = grpc.Note.req.getMany(data) // TODO: handle filter, sort and paginate
      const response = await grpc.Note.getMany(request)

      return response.notes
    },
    getInstrument: async (_, { id }, { grpc }) => {
      Log.info('Query.getInstrument')
      Log.debug('Request @ getInstrument', { id })

      if (grpc.Instrument === undefined)
        return null
        
      const request = grpc.Instrument.req.get({ id: id ?? '' })
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
        
      const request = grpc.Instrument.req.getMany({}) // TODO: handle filter, sort and paginate
      const response = await grpc.Instrument.getMany(request)

      const mappedResponse: Instrument[] = response.instruments.map(obj => ({
        ...obj,
        defaultTuning: { id: obj.defaultTuningId || null } as Tuning,
      }))

      return mappedResponse
    },
    getTuning: async (_, { id }, { grpc }) => {
      Log.info('Query.getTuning')
      Log.debug('Request @ getTuning', { id })

      if (grpc.Tuning === undefined)
        return null
        
      const request = grpc.Tuning.req.get({ id: id ?? '' })
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
        
      const request = grpc.Tuning.req.getMany({}) // TODO: handle filter, sort and paginate
      const response = await grpc.Tuning.getMany(request)

      const mappedResponse: Tuning[] = response.tunings.map(obj => ({
        ...obj,
        instrument: { id: obj.instrumentId || null } as Instrument,
        notes: obj.notes.map(obj2 => ({ ...obj2, note: { id: obj2.noteId || null } as Note }))
      }))

      return mappedResponse
    },
    getScale: async (_, { id }, { grpc }) => {
      Log.info('Query.getScale')
      Log.debug('Request @ getScale', { id })

      if (grpc.Scale === undefined)
        return null
        
      const request = grpc.Scale.req.get({ id: id ?? '' })
      const response = await grpc.Scale.get(request)

      return response.scale ?? null
    },
    getScales: async (_, { filter, sort, paginate }, { grpc }) => {
      Log.info('Query.getScales')
      Log.debug('Request @ getScales', { filter, sort, paginate })

      if (grpc.Scale === undefined)
        return []
        
      const request = grpc.Scale.req.getMany({}) // TODO: handle filter, sort and paginate
      const response = await grpc.Scale.getMany(request)

      return response.scales
    },
  },
  Mutation: {
    addNote: async (_, { input }, { grpc }) => {
      Log.info('Mutation.addNote')
      Log.debug('Request @ addNote', { input })

      if (grpc.Note === undefined)
        return null

      const request = grpc.Note.req.add(input ?? {})
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
      const request = grpc.Note.req.update({ id: id ?? '', ...data })
      const response = await grpc.Note.update(request)

      return response.note ?? null
    },
    deleteNote: async (_, { id }, { grpc }) => {
      Log.info('Mutation.deleteNote')
      Log.debug('Request @ deleteNote', { id })

      if (grpc.Note === undefined)
        return null

      const request = grpc.Note.req.delete({ id: id ?? '' })
      const response = await grpc.Note.delete(request)

      return response.id ?? null
    },
    addInstrument: async (_, { input }, { grpc }) => {
      Log.info('Mutation.addInstrument')
      Log.debug('Request @ addInstrument', { input })

      if (grpc.Instrument === undefined)
        return null

      const request = grpc.Instrument.req.add(input ?? {})
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
      const request = grpc.Instrument.req.update({ id: id ?? '', ...data })
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

      const request = grpc.Instrument.req.delete({ id: id ?? '' })
      const response = await grpc.Instrument.delete(request)

      return response.id ?? null
    },
    addTuning: async (_, { input }, { grpc }) => {
      Log.info('Mutation.addTuning')
      Log.debug('Request @ addTuning', { input })

      if (grpc.Tuning === undefined)
        return null

      const request = grpc.Tuning.req.add(input ?? {})
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
      const request = grpc.Tuning.req.update({ id: id ?? '', ...data })
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

      const request = grpc.Tuning.req.delete({ id: id ?? '' })
      const response = await grpc.Tuning.delete(request)

      return response.id ?? null
    },
    addScale: async (_, { input }, { grpc }) => {
      Log.info('Mutation.addScale')
      Log.debug('Request @ addScale', { input })

      if (grpc.Scale === undefined)
        return null

      const request = grpc.Scale.req.add(input ?? {})
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
      const request = grpc.Scale.req.update({ id: id ?? '', ...data })
      const response = await grpc.Scale.update(request)

      return response.scale ?? null
    },
    deleteScale: async (_, { id }, { grpc }) => {
      Log.info('Mutation.deleteScale')
      Log.debug('Request @ deleteScale', { id })

      if (grpc.Scale === undefined)
        return null

      const request = grpc.Scale.req.delete({ id: id ?? '' })
      const response = await grpc.Scale.delete(request)

      return response.id ?? null
    },
  },
  Instrument: {
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
  },
  Tuning: {
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
  },
  PhysicalNote: {
    note: async (parent, _, { grpc }) => {
      Log.info('Resolver.PhysicalNote.note')
      Log.debug('Request @ PhysicalNote.PhysicalNote', { parent })

      if (grpc.Note === undefined)
        return null

      const request = grpc.Note.req.get({ id: parent.note?.id })
      const response = await grpc.Note.get(request)

      return response.note ?? null
    }
  },
  VariedPrimitive: variedPrimitiveScalar,
}