import type { IPhysicalNote, ISound, Pitch } from 'api-types'

import { isType } from './types'


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