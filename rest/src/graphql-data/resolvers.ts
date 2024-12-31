import type { InstrumentDoc, TuningDoc, TuningNote } from 'types/db'
import type { FilterForType } from './scalars'

import { stringToObjectId } from '../utils/types'
import { filterForTypeScalar } from './scalars'

import db from '../db'


type FilterType = 
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'greater_or_equals'
  | 'less_than'
  | 'less_or_equals'
  | 'includes'
  | 'not_includes'

type SortOrder = 
  | 'asc' 
  | 'desc'

type FilteringInput = { 
  filterBy?: string 
  filterType?: FilterType
  filterFor?: FilterForType
}

type SortingInput = {
  sortBy?: string
  order?: SortOrder
}

type PaginatingInput = {
  page?: number
  limit?: number
}

type UXInputs = {
  filter?: FilteringInput
  sort?: SortingInput
  paginate?: PaginatingInput
}


// TODO: those three are super similair to in /src/middleware/response.tx
const applyFiltering = <T>(data: T[], { filterBy, filterType, filterFor }: FilteringInput = {}) => {
  if (filterBy === undefined || filterFor === undefined)
    return data

  filterType = filterType ? filterType.toLowerCase() as FilterType : 'equals'

  const key = filterBy as keyof typeof data[number]
  const filterForNumber = (value: number): boolean => {
    if (typeof filterFor !== 'number')
      return false

    switch (filterType) {
      case 'equals':            return value === filterFor
      case 'not_equals':        return value !== filterFor
      case 'greater_than':      return filterFor > value
      case 'greater_or_equals': return filterFor >= value
      case 'less_than':         return filterFor < value
      case 'less_or_equals':    return filterFor <= value
      default:                  return false
    }
  }
  const filterForString = (value: string): boolean => {
    if (typeof filterFor !== 'string')
      return false

    switch (filterType) {
      case 'equals':       return value === filterFor
      case 'not_equals':   return value !== filterFor
      case 'includes':     return value.includes(filterFor)
      case 'not_includes': return !value.includes(filterFor)
      default:             return false
    }
  }
  const filterForBoolean = (value: boolean): boolean => {
    if (typeof filterFor !== 'boolean')
      return false

    switch (filterType) {
      case 'equals':     return value === filterFor
      case 'not_equals': return value !== filterFor
      default:           return false
    }
  }
  const filterForType = (value: unknown): boolean => {
    switch (typeof value) {
      case 'number':  return filterForNumber(value)
      case 'string':  return filterForString(value)
      case 'boolean': return filterForBoolean(value)
      default:        return false
    }
  }

  return data.filter(obj => obj?.[key] && filterForType(obj[key]))
}

const applySorting = <T>(data: T[], { sortBy, order }: SortingInput = {}) => {
  if (sortBy === undefined || order === undefined)
    return data

  const dir = order.toLowerCase() === 'asc' ? 1 : -1
  const key = sortBy as keyof typeof data[number]
  const newData = data.sort((a, b) => {
    const aV = a?.[key]
    const bV = b?.[key]

    if (aV === undefined || aV === null || bV === undefined || bV === null)
      return 1

    const v = aV < bV ? -1 : 1
    return v * dir
  })

  return newData
}

const applyPaginating = <T>(data: T[], { page, limit }: PaginatingInput = {}) => {
  if (page === undefined || limit === undefined)
    return data

  const xPage = isNaN(Number(page)) ? 0 : Number(page) // technically not needed as `typeof page is number`, but keeps it consistent with REST logic
  const xLimit = isNaN(Number(limit)) ? 0 : Number(limit)
  const itemMul = xLimit < 1 ? 1 : xLimit
  const start = xPage < 2 ? 0 : (xPage - 1) * itemMul
  const end = xLimit < 1 ? undefined : xPage * itemMul

  return data.slice(start, end)
}


export const resolvers = {
  Query: {
    notes: async (_: unknown, { filter, sort, paginate }: UXInputs) => {
      let data = await db.notes.getMany()
      data = applyFiltering(data, filter)
      data = applySorting(data, sort)
      data = applyPaginating(data, paginate)
      return data
    },
    note: async (_: unknown, { _id }: { _id: string }) => {
      let data = await db.notes.getOne({ _id: stringToObjectId(_id) })
      return data
    },
    instruments: async (_: unknown, { filter, sort, paginate }: UXInputs) => {
      let data = await db.instruments.getMany()
      data = applyFiltering(data, filter)
      data = applySorting(data, sort)
      data = applyPaginating(data, paginate)
      return data
    },
    instrument: async (_: unknown, { _id }: { _id: string }) => {
      let data = await db.instruments.getOne({ _id: stringToObjectId(_id) })
      return data
    },
    tunings: async (_: unknown, { filter, sort, paginate }: UXInputs) => {
      let data = await db.tunings.getMany()
      data = applyFiltering(data, filter)
      data = applySorting(data, sort)
      data = applyPaginating(data, paginate)
      return data
    },
    tuning: async (_: unknown, { _id }: { _id: string }) => {
      let data = await db.tunings.getOne({ _id: stringToObjectId(_id) })
      return data
    },
    scales: async (_: unknown, { filter, sort, paginate }: UXInputs) => {
      let data = await db.scales.getMany()
      data = applyFiltering(data, filter)
      data = applySorting(data, sort)
      data = applyPaginating(data, paginate)
      return data
    },
    scale: async (_: unknown, { _id }: { _id: string }) => {
      let data = await db.scales.getOne({ _id: stringToObjectId(_id) })
      return data
    },
  },
  Instrument: {
    defaultTuning: async (parent: InstrumentDoc) => await db.tunings.getOne({ _id: parent.defaultTuning }),
  },
  Tuning: {
    instrument: async (parent: TuningDoc) => await db.instruments.getOne({ _id: parent.instrument }),
  },
  TuningNotes: {
    note: async (parent: TuningNote) => await db.notes.getOne({ _id: parent.note }),
  },
  FilterForType: filterForTypeScalar,
}