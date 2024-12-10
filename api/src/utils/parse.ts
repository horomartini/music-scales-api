import type { Note, PhysicalNote } from 'types/api'

import { flatSymbols, flatToSharp, sharpSymbols } from './sound'
import { ResponseError } from '../utils/errors'


export const parseNote = (note: string): PhysicalNote | Note => {
  if (note.length < 1 || note.length > 3)
    throw new ResponseError(400, `Invalid note name, e.g. D4, A, F#, Db2`, '<note><sharp|flat|empty><octave|empty>')

  let name = note.slice(0, 2)
  const octave = Number(note.slice(2))

  if (isNaN(octave) || octave < 0)
    throw new ResponseError(400, `Invalid octave '${note.slice(2)}'.`, 'octave: number >= 0')

  if (sharpSymbols.includes(name.charAt(1)))
    name = name.charAt(0).toUpperCase() + '#'
  else if (flatSymbols.includes(name.charAt(1)))
    name = flatToSharp({ name: name.charAt(0).toUpperCase() + 'b' }, '#').name

  return octave === 0
    ? { name } as Note
    : { name, octave } as PhysicalNote
}