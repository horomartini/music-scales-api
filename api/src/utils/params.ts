import type { IPhysicalNote, INote, IQueryAll } from 'api-types'
import { applyFiltering, applyPagination, applySorting } from './rest'
import { log } from './logger'

export const getQueryParams = <T>(query: T, extract: { [K in keyof T]: T[K] }) => {
  const result = {} as T

  for (const key in extract) {
    result[key] = (query?.[key] ?? extract[key])
  }

  return result
}

export const parseNote = (note: string): IPhysicalNote | INote => {
  if (note.includes('s'))
    note = note.replace('s', '#')

  if (/\d/.test(note))
    return {
      name: note.slice(0, -1),
      octave: Number(note.slice(-1)),
    } as IPhysicalNote
  return { name: note } as INote
}

export const parseNotes = (notes: string) => {
  const notesArr: string[] = notes.split(',') || []
  const notesObjs: (IPhysicalNote | INote)[] = notesArr.map(parseNote)
  return notesObjs
}

export const applyBasicsFromParams = (params: any, data: any[]) => {
  if (params.filterBy !== '' && params.filterFor !== '') {
    data = applyFiltering(data, params.filterBy, params.filterFor)
  }

  if (params.sortBy !== '') {
    data = applySorting(data, params.sortBy, params.order)
  }

  if (params.groupBy !== '') {
    log('warn', 'Not implemented')
  }

  if (params.page !== -1) {
    data = applyPagination(data, params.page, params.limit)
  }

  if (params.hateoas === true) {
    log('warn', 'Not implemented')
  }

  return data
}
