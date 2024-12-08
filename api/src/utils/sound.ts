import type { IPhysicalNote, ISound, Pitch } from 'api-types'

import { isType } from './types'
import type { Note } from 'types/api'


export const sharpSymbols = ['s', '♯', '#']
export const flatSymbols = ['b', '♭']


export const calcAbsFreq = (
  target: IPhysicalNote, 
  ref: ISound = { name: 'A', octave: 4, pitch: 440 },
  allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', ]
): Pitch => {
  const twelfthRootOfTwo = Math.pow(2, 1 / 12)
  const refPos = ref.octave * allNotes.length + allNotes.indexOf(ref.name)
  const targetPos = target.octave * allNotes.length + allNotes.indexOf(target.name)

  return ref.pitch * Math.pow(twelfthRootOfTwo, targetPos - refPos)
}

export const calc12TET = (
  target: Pitch | IPhysicalNote,
  ref: ISound = { name: 'A', octave: 4, pitch: 440 },
  allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', ]
): Pitch => {
  const physicalNote: IPhysicalNote = { name: String(), octave: Number() }
  const targetPitch = isType(physicalNote, target)
    ? calcAbsFreq(target, ref, allNotes)
    : target
  const x = 1 / 12 * Math.round(12 * Math.log2(targetPitch / ref.pitch))

  return ref.pitch * Math.pow(2, x)
}

export const sharpToFlat = (
  target: Note,
  flat = flatSymbols[0],
  sharps = sharpSymbols,
  allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
): Note => {
  if (target.name.length < 1 || target.name.length > 2)
    throw new Error(`Note name must have its length in range [1, 2], e.g. 'C', 'D#', 'Ab'.`)

  if (target.name.length < 2 || !sharps.includes(target.name.charAt(1)))
    return target

  const note: string | undefined = allNotes.find(note => note === target.name)

  if (note === undefined)
    throw new Error(`Note ${target.name} not found in list of valid notes.`)

  const flatIdx = allNotes.indexOf(note) + 1 // if A#: find A#, then get idx of B

  if (flatIdx >= allNotes.length)
    throw new Error(`Flat note of ${target.name} cannot be right of ${note} - index (${flatIdx}) out of bounds.`)

  // C Db D Eb E F Gb G Ab A Bb B
  return { name: allNotes[flatIdx] + flat } as Note
}

export const flatToSharp = (
  target: Note,
  sharp = sharpSymbols[0],
  flats = flatSymbols,
  allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
): Note => {
  if (target.name.length < 1 || target.name.length > 2)
    throw new Error(`Note name must have its length in range [1, 2], e.g. 'C', 'D#', 'Ab'.`)

  if (target.name.length < 2 || !flats.includes(target.name.charAt(1)))
    return target

  const note: string | undefined = allNotes.find(note => note === target.name.charAt(0))

  if (note === undefined)
    throw new Error(`Note ${target.name} not found in list of valid notes.`)

  const sharpIdx = allNotes.indexOf(note) - 2  // if Db: find D, then get idx of C

  if (sharpIdx < 0)
    throw new Error(`Flat note of ${target.name} cannot be right of ${note} - index (${sharpIdx}) out of bounds.`)

  return { name: allNotes[sharpIdx] + sharp } as Note
}
