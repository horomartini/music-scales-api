import { INote, IPhysicalNote, IScale, IScaleExt, ISound } from "api-types"

export const isNote = (obj: any): obj is INote =>
  'name' in obj && typeof obj.name === 'string'

export const isPhysicalNote = (obj: any): obj is IPhysicalNote => 
  isNote(obj) &&
  'octave' in obj && typeof obj.octave === 'number'

export const isSound = (obj: any): obj is ISound => 
  isPhysicalNote(obj) && 
  'pitch' in obj && typeof obj.pitch === 'number'

export const isScale = (obj: any): obj is IScale =>
  'name' in obj &&      typeof obj.name === 'string' &&
  'keywords' in obj &&  Array.isArray(obj.keywords) &&
  'steps' in obj &&     Array.isArray(obj.steps)

export const isScaleExt = (obj: any): obj is IScaleExt =>
  'name' in obj &&      typeof obj.name === 'string' &&
  'keywords' in obj &&  Array.isArray(obj.keywords) &&
  'key' in obj &&       typeof obj.key === 'string' && 
  'notes' in obj &&     Array.isArray(obj.notes)
