import type { IPhysicalNote, INote, Pitch, ISound } from 'api-types'
import db from '../db/sample-db'

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

export const parseNotes = (notes?: string): (IPhysicalNote | INote)[] => {
  if (notes === undefined)
    return []
  const notesArr: string[] = notes.split(',') || []
  const notesObjs: (IPhysicalNote | INote)[] = notesArr.map(parseNote)
  return notesObjs
}

export const parseNoteRef = (name: string, octave: number, pitch: Pitch): ISound => {
  const ogRef = db.getRef()

  if (name === '' || octave === -1 || pitch === -1) {
    if (ogRef === null || ogRef.sound === null)
      throw Error('Note reference in server database is null.')
    return ogRef.sound
  }

  return { name, octave, pitch } as ISound
}

export const parseBooleanQuery = (value: string | boolean | undefined): boolean => 
  value !== undefined && value !== 'false' && value !== false

export const parseDeactivatorQuery = (value: string | boolean | undefined): boolean =>
  value !== 'false' && value !== false

export const parseNumberQuery = (value: string | number | undefined): number =>
  value === undefined || isNaN(Number(value)) ? -1 : Number(value)

export const parseStringQuery = (value: string | undefined): string =>
  value === undefined ? '' : value

export const parseLiteralQuery = <T extends string>(value: string | undefined, or: string): T =>
  value === undefined ? <T>or : <T>value
