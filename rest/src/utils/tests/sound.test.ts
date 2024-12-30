import { ISound } from 'api-types'
import * as func from '../sound'


const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const noteRef: ISound = { name: 'A', octave: 4, pitch: 440 } as const


describe('calcAbsFreq', () => {
  it('should return estimate value of pitch from PhysicalNote', () => {
    const result = func.calcAbsFreq({ name: 'F', octave: 4 }, noteRef, notes)
    const roundedResult = result.toFixed(2)
    expect(roundedResult).toBe('349.23')
  })
})

describe('calc12TET', () => {
  it('should return estimate value of pitch from estimated pitch', () => {
    const result = func.calc12TET(350, noteRef, notes)
    const roundedResult = result.toFixed(2)
    expect(roundedResult).toBe('349.23')
  })
})